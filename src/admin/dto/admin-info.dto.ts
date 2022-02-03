import { IsString } from "class-validator";
import { PickType, PartialType } from "@nestjs/swagger";
import { CommonOutPut } from "src/common/dto/common.dto";
import { AdminInfoEntity } from "../entities/admin-info.entity";

export class AdminCreateInputDto extends PickType(
  PartialType(AdminInfoEntity),
  ["adminId", "adminPw", "adminName", "adminEmail", "role"],
) {}

export class AdminCreateOutputDto extends CommonOutPut {}

export class AdminMeOutPutDto extends PickType(PartialType(AdminInfoEntity), [
  "adminId",
  "adminName",
  "adminEmail",
  "role",
  "createdAt",
]) {
  @IsString()
  error?: string;
}
