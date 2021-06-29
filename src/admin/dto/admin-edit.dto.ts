import { Column } from "typeorm";
import { IsEmail, IsString } from "class-validator";

export class AdminEditInput {
  @Column()
  @IsEmail()
  adminEmail: string;

  @Column()
  @IsString()
  adminPw: string;
}
