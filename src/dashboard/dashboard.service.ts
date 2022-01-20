import { Injectable } from "@nestjs/common";
import { InfoEntity, StatusStep } from "src/common/entities/info.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { toISODate } from "src/utils/date";
import { getSearchDataSelected, getInfoDataSelected } from "./dashboard.config";

@Injectable()
export class DashBoardService {
  constructor(
    @InjectRepository(InfoEntity) private readonly info: Repository<InfoEntity>,
  ) {}

  async getEndInfoData() {
    try {
      const endInfoDatas = await this.info
        .createQueryBuilder("info_entity")
        .leftJoin(`info_entity.clientInfo`, "clientInfo")
        .leftJoin(`info_entity.baseInfo`, "baseInfo")
        .leftJoin(`info_entity.detailInfo`, "detailInfo")
        .leftJoin(`info_entity.review`, "review")
        .where("info_entity.status = :status", {
          status: `${StatusStep.end}`,
        })
        .select([...getInfoDataSelected])
        .getMany();

      if (endInfoDatas) {
        return endInfoDatas;
      }
    } catch (error) {}
  }

  async getSearchata(searchData: any) {
    const { status, isConfidential, startDate, endDate } = searchData;
    const endEnum = StatusStep.end;
    try {
      const endReviewDatas = await this.info
        .createQueryBuilder("info_entity")
        .leftJoin(`info_entity.clientInfo`, "clientInfo")
        .leftJoin(`info_entity.review`, "review")
        .select([...getSearchDataSelected])
        .where(
          `info_entity.status ${
            status === endEnum ? "=" : "!="
          } :status AND info_entity.updateAt >= :startDate
            AND info_entity.updateAt <= :endDate
          ${
            isConfidential
              ? "AND info_entity.isConfidential = :isConfidential"
              : ""
          }
          `,
          {
            status: `${endEnum}`,
            ...(isConfidential && { isConfidential: `${isConfidential}` }),
            startDate: toISODate(startDate, 1970),
            endDate: toISODate(endDate),
          },
        )
        .getMany();

      if (endReviewDatas) {
        return endReviewDatas;
      }
    } catch (error) {
      return { error };
    }
  }
}
