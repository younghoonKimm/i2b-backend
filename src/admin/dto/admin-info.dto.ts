import { Column } from "typeorm";
import { IsString, Length, IsEmail } from "class-validator";

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
