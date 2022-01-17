import { IsString, IsArray } from "class-validator";
import { PickType, PartialType } from "@nestjs/swagger";
import { AdminInfoEntity } from "../entities/admin-info.entity";

export class AllUserOutput extends PickType(PartialType(AdminInfoEntity), [
  "adminId",
  "adminEmail",
  "updateAt",
  "adminName",
  "role",
  "id",
]) {}

export class AdminAllUserOutput {
  @IsArray()
  users?: AllUserOutput[];

  @IsString()
  error?: string;
}
