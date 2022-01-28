import { Column } from "typeorm";
import {
  IsString,
  Length,
  IsEmail,
  IsBoolean,
  IsObject,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AdminLoginInput {
  @ApiProperty({
    example: "system",
    required: true,
  })
  @IsString()
  adminId: string;

  @ApiProperty({
    example: "olivestonelab12##",
    required: true,
  })
  @IsString()
  @Length(13, 30)
  adminPw: string;
}

export class AdminLoginOutput {
  @ApiProperty()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  token?: string;

  @ApiProperty()
  @IsBoolean()
  error?: string;
}
