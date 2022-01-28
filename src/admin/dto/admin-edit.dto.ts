import { IsEmail, IsString } from "class-validator";
import { ApiProperty, PickType, PartialType } from "@nestjs/swagger";
import { CommonOutPut } from "src/common/dto/common.dto";
import { AdminInfoEntity } from "../entities/admin-info.entity";

export class AdminEditInput {
  adminChnagePw?: string;

  adminEmail?: string;

  adminPw?: string;
}

export class AdminEditOutput extends CommonOutPut {}
