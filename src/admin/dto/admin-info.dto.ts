import { Column } from "typeorm";
import { IsString, Length, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AdminInfoInputDto {
  @Column()
  @IsString()
  adminId: string;

  @Column()
  @IsString()
  @Length(13, 30)
  adminPw: string;

  @Column()
  @IsString()
  adminName: string;

  @Column()
  @IsEmail()
  adminEmail: string;
}

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
