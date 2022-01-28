import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CommonOutPut } from "src/common/dto/common.dto";

export class AdminEditInput {
  @IsEmail()
  @ApiProperty({
    example: "dev@olivestonelab.com",
  })
  adminEmail?: string;

  @IsString()
  @ApiProperty({
    example: "olivestonelab12##",
  })
  adminPw?: string;

  @IsString()
  @ApiProperty({
    example: "olivestonelab12##",
  })
  adminChnagePw?: string;
}

export class AdminEditOutput extends CommonOutPut {}
