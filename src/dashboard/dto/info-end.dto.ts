import { PickType, PartialType } from "@nestjs/swagger";
import { InfoEntity } from "src/common/entities/info.entity";
import { ReviewEntity } from "src/info/entities/review.entitiy";

class AllInfoDto extends PickType(PartialType(InfoEntity), [
  "isConfidential",
  "detailInfo",
  "baseInfo",
]) {}

class InfoDashboardData extends PickType(PartialType(InfoEntity), [
  "clientInfo",
  "id",
  "status",
  "isConfidential",
  "updateAt",
]) {}

export class EndInfoOutput {
  allData?: AllInfoDto[];

  infoData?: InfoDashboardData[];

  error?: string;
}

export class AllSearchInputData {}

export class AllSearchOutputData {
  infoData?: InfoDashboardData[];

  totalPages?: number;

  error?: string;
}
