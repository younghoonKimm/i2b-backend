import { Column } from "typeorm";
import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AdminEditInput {
  @ApiProperty({
    example: "dev@olivestonelab.com",
  })
  @Column()
  @IsEmail()
  adminEmail: string;

  @ApiProperty({
    example: "olivestonelab12##",
  })
  @Column()
  @IsString()
  adminPw: string;
}
