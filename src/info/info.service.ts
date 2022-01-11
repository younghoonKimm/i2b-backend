import { Injectable } from "@nestjs/common";

import { InfoEntity, StatusStep } from "../common/entities/info.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, Brackets, Connection, In, QueryRunner } from "typeorm";
import { Repository } from "typeorm";
import { ClientInfoEntity } from "./entities/client-info.entity";
import { ClientInfoDto, ClientInfoOutput } from "./dto/client-info.dto";
import { InfoDto } from "src/common/dto/info.dto";
import { JwtService } from "src/jwt/jwt.service";
import { BaseInfoEntity } from "./entities/base-info.entity";
import { MailService } from "src/mail/mail.service";
import { ManageMentCategoryEntites } from "src/management/entities/category.entity";

const infoArray = { clientInfo: ClientInfoEntity, baseInfo: BaseInfoEntity };

@Injectable()
export class InfoService {
  constructor(
    private connection: Connection,
    @InjectRepository(InfoEntity) private readonly info: Repository<InfoEntity>,
    @InjectRepository(ClientInfoEntity)
    private readonly clientInfo: Repository<ClientInfoEntity>,
    @InjectRepository(BaseInfoEntity)
    private readonly baseInfo: Repository<BaseInfoEntity>,
    @InjectRepository(ManageMentCategoryEntites)
    private readonly categoryEntity: Repository<ManageMentCategoryEntites>,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async getUser(clientEmail: string) {
    const user = await this.info.findOne(clientEmail, {
      relations: ["clientInfo", "baseInfo"],
    });

    return user;
  }

  async findById(id: string): Promise<InfoDto> {
    return await this.info.findOne({ id });
  }

  async getInfo(id: string) {
    // return await this.info.findOne({id},{relations:})
  }

  async getCategories() {
    return await this.categoryEntity.find();
  }

  async saveInfo(infoData: InfoDto, id?: string): Promise<ClientInfoOutput> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exists = await this.info
        .createQueryBuilder("info_entity")
        .leftJoinAndSelect(`info_entity.clientInfo`, "clientInfo")
        .leftJoinAndSelect(`info_entity.baseInfo`, "baseInfo")
        .getOne();

      if (exists) {
        if (exists[infoData.status]) {
          await queryRunner.manager.save(infoArray[infoData.status], {
            ...exists[infoData.status],
            ...infoData[infoData.status],
          });
        } else {
          const infoStatusData = await queryRunner.manager.save(
            infoArray[infoData.status],
            infoData[infoData.status],
          );

          await queryRunner.manager.save(InfoEntity, {
            ...exists,
            status: StatusStep[infoData.status],
            [infoData.status]: infoStatusData,
          });
        }

        await queryRunner.commitTransaction();
      } else {
        await queryRunner.rollbackTransaction();
        return { error: "오류" };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { error };
    } finally {
      queryRunner.release();
    }
  }

  async createInfo(infoData: InfoDto): Promise<ClientInfoOutput> {
    const queryRunner = this.connection.createQueryRunner();
    try {
      const exists = await this.info.findOne({
        clientEmail: infoData.clientEmail,
      });

      if (exists) {
        const token = this.jwtService.sign({ id: exists.id });
        return { token, error: "존재하는 이메일" };
      }

      const { clientInfo, password } = infoData;

      const crateClientInfo = await this.clientInfo.save(
        this.clientInfo.create(clientInfo),
      );

      // await queryRunner.connect();
      // await queryRunner.startTransaction();
      // const crateBaseInfo =
      //   baseInfo && (await this.baseInfo.save(this.baseInfo.create(baseInfo)));

      const newInfoData = await this.info.save(
        this.info.create({
          clientEmail: clientInfo.clientEmail,
          password,
          clientInfo: crateClientInfo,
          // baseInfo: crateBaseInfo,
        }),
      );
      const token = this.jwtService.sign({ id: newInfoData.id });

      await this.mailService.sendToClient();

      return { token };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { error };
    } finally {
      queryRunner.release();
    }
  }

  async uploadFile() {}
}
