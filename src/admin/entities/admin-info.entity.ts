import { Entity, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";
import { IsString, IsNumber, Length, IsEmail } from "class-validator";

import * as bcrypt from "bcrypt";
import { CommonEntitiy } from "src/common/entities/common.entity";

enum adminRole {
  system,
  see,
}

@Entity()
export class AdminInfoEntity extends CommonEntitiy {
  @Column()
  @IsString()
  adminId: string;

  @Column({ nullable: true, select: false })
  @IsString()
  @Length(13, 30)
  adminPw: string;

  @Column()
  @IsString()
  adminName: string;

  @Column()
  @IsEmail()
  adminEmail: string;

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
