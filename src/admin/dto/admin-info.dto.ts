import { Column } from "typeorm";
import { IsString, Length, IsEmail, IsEnum } from "class-validator";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { CommonOutPut } from "src/common/dto/common.dto";
import { AdminRole } from "../entities/admin-info.entity";

export class AdminCreateInputDto {
  @IsString()
  @ApiProperty({
    example: "system",
  })
  adminId: string;

  @IsString()
  @Length(13, 30)
  @ApiProperty({
    example: "olivestonelab12##",
  })
  adminPw: string;

  @IsString()
  @ApiProperty({
    example: "system",
  })
  adminName: string;

  @IsEmail()
  @ApiProperty({
    example: "dev@olivestonelab.com",
  })
  adminEmail: string;

  @IsEnum(AdminRole)
  @ApiProperty({
    example: AdminRole.Watch,
  })
  role?: AdminRole;
}

export class AdminCreateOutputDto extends CommonOutPut {}

export class AdminMeOutPutDto {
  @IsString()
  @ApiProperty({
    example: "system",
  })
  adminId?: string;

  @IsString()
  @ApiProperty({
    example: "system",
  })
  adminName?: string;

  @IsEmail()
  @ApiProperty({
    example: "dev@olivestonelab.com",
  })
  adminEmail?: string;

  @IsString()
  error?: string;
}
