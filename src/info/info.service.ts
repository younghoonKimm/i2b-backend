import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { Connection, Repository } from "typeorm";

import { InfoEntity, StatusStep } from "../common/entities/info.entity";
import { ClientInfoEntity } from "./entities/client-info.entity";
import { ClientInfoOutput } from "./dto/client-info.dto";
import { InfoDto } from "src/common/dto/info.dto";
import { JwtService } from "src/jwt/jwt.service";
import { BaseInfoEntity } from "./entities/base-info.entity";
import { MailService } from "src/mail/mail.service";
import { ManageMentCategoryEntites } from "src/management/entities/category.entity";
import { tokenInterface } from "src/common/dto/common.dto";

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
    private readonly manageMentCategoryEntity: Repository<ManageMentCategoryEntites>,
    private readonly jwtService: JwtService,
    private schedulerRegistry: SchedulerRegistry,
    private mailService: MailService,
  ) {}

  async getUser({ id }: tokenInterface) {
    try {
      const user = await this.info.findOne(id, {
        relations: ["clientInfo", "baseInfo", "detailInfo", "scheduleinfo"],
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id: string): Promise<InfoDto> {
    return await this.info.findOne({ id });
  }

  async getInfo(id: string) {
    // return await this.info.findOne({id},{relations:})
  }

  async getCategories() {
    return await this.manageMentCategoryEntity.find();
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
        .where("info_entity.id = :id", { id })
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
        return { error: "토큰 오류" };
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
      // const exists = await this.info.findOne({
      //   clientEmail: infoData.clientEmail,
      // });

      if (!infoData.clientInfo) return { error: "에러" };

      // if (exists) {
      //   const token = this.jwtService.sign({ id: exists.id });
      //   return { token, error: "존재하는 이메일" };
      // }

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
          status: StatusStep.clientInfo,
          clientInfo: crateClientInfo,
          // baseInfo: crateBaseInfo,
        }),
      );
      const token = this.jwtService.sign({ id: newInfoData.id });

      if (password) {
        // await this.mailService.sendToClient();
      }

      return { token };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { error };
    } finally {
      queryRunner.release();
    }
  }

  // @Cron("0 1 * * *", {
  //   name: "deleteNotComplete",
  // })
  @Cron("10 * * * * *", {
    name: "deleteNotComplete",
  })
  async deleteNotComplete() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // const compareDate = new Date()
    //   .setDate(new Date().getDate() + 7)
    //   .toISOString();

    const compareDate = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const cate = await queryRunner.query(
      `SELECT * FROM info_entity
         WHERE "updateAt" >= '${compareDate}'`,
    );

    console.log(cate);
    return await queryRunner.query(
      `DELETE FROM info_entity
         WHERE "updateAt" >= '${compareDate}'`,
    );
  }
}
