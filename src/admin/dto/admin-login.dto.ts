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
  @Column()
  @IsString()
  adminId: string;

  @ApiProperty({
    example: "olivestonelab12##",
    required: true,
  })
  @Column()
  @IsString()
  @Length(13, 30)
  adminPw: string;
}

export class AdminLoginOutput {
  @ApiProperty()
  @Column({ nullable: true })
  @IsString()
  id?: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsString()
  token?: string;

  @ApiProperty()
  @Column()
  @IsBoolean()
  error?: string;
}
