import { Entity, Column, BeforeInsert, OneToOne, JoinColumn } from "typeorm";
import { CommonEntitiy } from "src/common/entities/common.entity";
import { IsString, IsEnum, Length, IsEmail } from "class-validator";
import * as bcrypt from "bcrypt";

import { InternalServerErrorException } from "@nestjs/common";
import { ClientInfoEntity } from "src/info/entities/client-info.entity";
import { BaseInfoEntity } from "src/info/entities/base-info.entity";
import { DetailInfo } from "src/info/entities/detail-info.entity";

export enum StatusStep {
  clientInfo = "clientInfo",
  baseInfo = "baseInfo",
  detailInfo = "detailInfo",
  fourthStep = "fourthStep",
  end = "end",
}

@Entity()
export class InfoEntity extends CommonEntitiy {
  @Column()
  @IsEmail()
  @Length(5, 35)
  clientEmail: string;

  @Column({ nullable: true })
  @IsString()
  @Length(5)
  password?: string;

  @Column({ type: "enum", enum: StatusStep, default: StatusStep.clientInfo })
  @IsEnum(StatusStep)
  status: StatusStep;

  @OneToOne(() => ClientInfoEntity, (clientInfo) => clientInfo.info, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  clientInfo: ClientInfoEntity;

  @OneToOne(() => BaseInfoEntity, (baseInfo) => baseInfo.info, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  baseInfo: BaseInfoEntity;

  @OneToOne(() => DetailInfo, (baseInfo) => baseInfo.info, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  detailInfo: DetailInfo;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(inputPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
