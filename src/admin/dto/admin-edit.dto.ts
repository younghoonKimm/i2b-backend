import { Column } from "typeorm";
import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CommonOutPut } from "src/common/dto/common.dto";

export class AdminEditInput {
  @Column()
  @IsEmail()
  @ApiProperty({
    example: "dev@olivestonelab.com",
  })
  adminEmail: string;

  @Column()
  @IsString()
  @ApiProperty({
    example: "olivestonelab12##",
  })
  adminPw: string;
}

export class AdminEditOutput extends CommonOutPut {}
