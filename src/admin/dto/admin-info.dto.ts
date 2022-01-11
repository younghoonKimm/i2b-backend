import { Column } from "typeorm";
import { IsString, Length, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CommonOutPut } from "src/common/dto/common.dto";

export class AdminCreateInputDto {
  @Column()
  @IsString()
  @ApiProperty({
    example: "system",
  })
  adminId: string;

  @Column()
  @IsString()
  @Length(13, 30)
  @ApiProperty({
    example: "olivestonelab12##",
  })
  adminPw: string;

  @Column()
  @IsString()
  @ApiProperty({
    example: "system",
  })
  adminName: string;

  @Column()
  @IsEmail()
  @ApiProperty({
    example: "dev@olivestonelab.com",
  })
  adminEmail: string;
}

export class AdminCreateOutputDto extends CommonOutPut {}

export class AdminMeOutPutDto {
  @Column({ nullable: true })
  @IsString()
  adminId?: string;

  @Column({ nullable: true })
  @IsString()
  adminName?: string;

  @Column({ nullable: true })
  @IsEmail()
  adminEmail?: string;

  @Column({ nullable: true })
  @IsString()
  error?: string;
}
