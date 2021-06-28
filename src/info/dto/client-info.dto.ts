import {
  IsString,
  IsNumber,
  IsOptional,
  Length,
  IsBoolean,
} from "class-validator";
import { PickType } from "@nestjs/swagger";
import { ClientInfo } from "../entities/client-info.entity";
import { Column } from "typeorm";
import { isError } from "joi";

export class ClientInfoDto extends ClientInfo {
  @Column({ nullable: true, select: false })
  @IsString()
  @Length(5)
  password?: string;
}

export class ClientInfoOutput {
  @Column()
  @IsBoolean()
  ok: boolean;

  @Column({ nullable: true })
  @IsString()
  token?: string;

  @Column({ nullable: true })
  @IsString()
  error?: string;
}
