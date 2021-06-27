import { Entity, Column, BeforeInsert } from "typeorm";
import { CommonEntitiy } from "src/common/entities/common.entity";

import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsString, Length } from "class-validator";

@Entity()
export class User extends CommonEntitiy {
  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(5)
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
