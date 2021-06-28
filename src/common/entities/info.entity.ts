import { Entity, Column, BeforeInsert, OneToOne, JoinColumn } from "typeorm";
import { CommonEntitiy } from "src/common/entities/common.entity";
import { IsString, IsEnum, Length } from "class-validator";
import * as bcrypt from "bcrypt";

import { InternalServerErrorException } from "@nestjs/common";
import { ClientInfo } from "src/info/entities/client-info.entity";
import { BaseInfo } from "src/info/entities/base-info.entity";
import { DetailInfo } from "src/info/entities/detail-info.entity";

enum StatusStep {
  firstStep,
  secondStep,
  thirdStep,
  fourthStep,
}

@Entity()
export class InfoEntity extends CommonEntitiy {
  @Column({ type: "enum", enum: StatusStep })
  @IsEnum(StatusStep)
  status: StatusStep;

  @Column()
  @IsString()
  clientEmail: string;

  @Column({ nullable: true }, { select: false })
  @IsString()
  @Length(5)
  password?: string;

  @OneToOne(() => ClientInfo, (clientInfo) => clientInfo.info, {
    nullable: false,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  clientInfo: ClientInfo;

  @OneToOne(() => BaseInfo, (baseInfo) => baseInfo.info, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  baseInfo: BaseInfo;

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
