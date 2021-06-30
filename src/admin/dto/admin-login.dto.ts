import { Column } from "typeorm";
import { IsString, Length, IsEmail, IsBoolean } from "class-validator";

export class AdminLoginInput {
  @Column()
  @IsString()
  adminId: string;

  @Column()
  @IsString()
  @Length(13, 30)
  adminPw: string;
}

export class AdminLoginOutput {
  @Column()
  @IsBoolean()
  ok: boolean;

  @Column({ nullable: true })
  @IsString()
  id?: string;

  @Column({ nullable: true })
  @IsString()
  token?: string;

  @Column()
  @IsBoolean()
  error?: string;
}
