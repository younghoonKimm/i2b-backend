import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cron } from "@nestjs/schedule";
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
import { DetailInfoEntity } from "./entities/detail-info.entity";
import { ScheduleInfoEntity } from "./entities/schedule-Info.entity";
import { ReviewEntity } from "./entities/review.entitiy";

const infoArray = {
  clientInfo: ClientInfoEntity,
  baseInfo: BaseInfoEntity,
  detailInfo: DetailInfoEntity,
  scheduleInfo: ScheduleInfoEntity,
};

@Injectable()
export class InfoService {
  constructor(
    private connection: Connection,
    @InjectRepository(InfoEntity) private readonly info: Repository<InfoEntity>,
    @InjectRepository(ClientInfoEntity)
    private readonly clientInfo: Repository<ClientInfoEntity>,
    @InjectRepository(ManageMentCategoryEntites)
    private readonly manageMentCategoryEntity: Repository<ManageMentCategoryEntites>,
    @InjectRepository(ReviewEntity)
    private readonly reviewEntity: Repository<ReviewEntity>,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async getUser({ id }: tokenInterface) {
    try {
      const user = await this.info.findOne(id, {
        relations: ["clientInfo", "baseInfo", "detailInfo", "scheduleInfo"],
      });

      return {
        isConfidential: user.isConfidential,
        status: user.status,
        clientInfo: user.clientInfo,
        baseInfo: user.baseInfo,
        detailInfo: user.detailInfo,
        scheduleInfo: user.scheduleInfo,
      };
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

    const { status } = infoData;
    const isEndStatus = status === StatusStep.end;

    try {
      const exists = await this.info
        .createQueryBuilder("info_entity")
        .leftJoinAndSelect(`info_entity.clientInfo`, "clientInfo")
        .leftJoinAndSelect(`info_entity.baseInfo`, "baseInfo")
        .leftJoinAndSelect(`info_entity.detailInfo`, "detailInfo")
        .leftJoinAndSelect(`info_entity.scheduleInfo`, "scheduleInfo")
        .leftJoinAndSelect(`info_entity.review`, "review")
        .where("info_entity.id = :id", { id })
        .getOne();

      if (exists) {
        if (isEndStatus) {
          const { clientInfo, baseInfo, detailInfo, scheduleInfo, review } =
            exists;
          if (clientInfo && baseInfo && detailInfo && scheduleInfo) {
            const newReview = await queryRunner.manager.save(ReviewEntity, {
              ...review,
              ...infoData.review,
            });
            await queryRunner.manager.save(InfoEntity, {
              ...exists,
              status: StatusStep.end,
              review: newReview,
            });
          } else {
            return { error: "항목 없음" };
          }
        }
        if (exists[infoData.status]) {
          await queryRunner.manager.save(infoArray[infoData.status], {
            ...exists[infoData.status],
            ...infoData[infoData.status],
          });
        } else if (!isEndStatus) {
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
    // const queryRunner = this.connection.createQueryRunner();

    try {
      // const exists = await this.info.findOne({
      //   clientEmail: infoData.clientEmail,
      // });

      if (!infoData.clientInfo) return { error: "dont't have  client Info" };

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
      return { error };
    }
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   return { error };
    // } finally {
    //   queryRunner.release();
    // }
  }

  @Cron("0 1 * * *", {
    name: "deleteNotComplete",
  })
  async deleteNotComplete() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const compareDate = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      await queryRunner.query(
        `DELETE FROM info_entity
          WHERE "updateAt" <= '${compareDate}'
          AND "status" != '${StatusStep.end}'
        `,
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
