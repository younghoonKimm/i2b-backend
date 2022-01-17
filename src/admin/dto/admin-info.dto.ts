import { Column } from "typeorm";
import { IsString, Length, IsEmail, IsEnum } from "class-validator";
import { ApiProperty, PickType, PartialType } from "@nestjs/swagger";
import { CommonOutPut } from "src/common/dto/common.dto";
import { AdminRole, AdminInfoEntity } from "../entities/admin-info.entity";

export class AdminCreateInputDto extends PickType(AdminInfoEntity, [
  "adminId",
  "adminPw",
  "adminName",
  "adminEmail",
  "role",
]) {}

export class AdminCreateOutputDto extends CommonOutPut {}

export class AdminMeOutPutDto extends PickType(PartialType(AdminInfoEntity), [
  "adminId",
  "adminName",
  "adminEmail",
  "role",
]) {
  @IsString()
  error?: string;
}
