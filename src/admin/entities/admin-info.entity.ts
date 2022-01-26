import { Entity, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";
import { IsString, Length, IsEmail, IsEnum } from "class-validator";

import * as bcrypt from "bcrypt";
import { CommonEntitiy } from "src/common/entities/common.entity";

export enum AdminRole {
  System = "System",
  Watch = "Watch",
}

@Entity()
export class AdminInfoEntity extends CommonEntitiy {
  @Column()
  @IsString()
  adminId: string;

  @Column({ nullable: true, select: false })
  @IsString()
  @Length(10, 30)
  adminPw: string;

  @Column({ type: "enum", enum: AdminRole, default: AdminRole.Watch })
  @IsEnum(AdminRole)
  role: AdminRole;

  @Column()
  @IsString()
  adminName: string;

  @Column()
  @IsEmail()
  adminEmail: string;

  // @Column({ nullable: true })
  // @Exclude()
  // currentHashedRefreshToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.adminPw) {
      try {
        this.adminPw = await bcrypt.hash(this.adminPw, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(inputPassword, this.adminPw);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
