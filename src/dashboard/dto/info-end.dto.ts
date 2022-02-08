import { PickType, PartialType } from "@nestjs/swagger";
import { InfoEntity } from "src/common/entities/info.entity";

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

class CountData {
  count?: string;

  element?: number;
}

class EndInfoCountData {
  projectStatus?: CountData[];

  projectDispatch?: CountData[];

  projectSelection?: CountData[];
}

export class EndInfoOutput {
  allData?: AllInfoDto[];

  count?: EndInfoCountData;

  infoData?: InfoDashboardData[];

  error?: string;
}

export class AllSearchInputData {}

export class AllSearchOutputData {
  infoData?: InfoDashboardData[];

  totalPages?: number;

  error?: string;
}
