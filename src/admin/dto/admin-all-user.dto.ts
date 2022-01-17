import { Column } from "typeorm";
import { IsEmail, IsString, IsArray } from "class-validator";
import { ApiProperty, PickType, PartialType } from "@nestjs/swagger";
import { CommonOutPut } from "src/common/dto/common.dto";
import { AdminInfoEntity } from "../entities/admin-info.entity";

export class AllUserOutput extends PickType(PartialType(AdminInfoEntity), [
  "adminId",
  "adminEmail",
  "updateAt",
  "adminName",
  "role",
]) {}

export class AdminAllUserOutput {
  @IsArray()
  users?: AllUserOutput[];

  @IsString()
  error?: string;
}
