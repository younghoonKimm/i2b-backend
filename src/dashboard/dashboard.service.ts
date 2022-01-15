import { Injectable } from "@nestjs/common";
import { InfoEntity, StatusStep } from "src/common/entities/info.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class DashBoardService {
  constructor(
    @InjectRepository(InfoEntity) private readonly info: Repository<InfoEntity>,
  ) {}

  async getEndInfoData() {
    try {
      // .leftJoinAndSelect(`info_entity.scheduleInfo`, "scheduleInfo")
      const endInfoDatas = await this.info
        .createQueryBuilder("info_entity")
        .select(["info_entity.isConfidential"])
        .leftJoinAndSelect(`info_entity.baseInfo`, "baseInfo")
        .leftJoinAndSelect(`info_entity.detailInfo`, "detailInfo")
        .where("info_entity.status = :status", {
          status: `${StatusStep.end}`,
        })
        .getMany();
      if (endInfoDatas) {
        return endInfoDatas;
      }

      //   const user = await this.info.find({
      //     relations: ["clientInfo", "baseInfo", "detailInfo", "scheduleInfo"],
      //   });
      //   return user;
    } catch (error) {}
  }
}
