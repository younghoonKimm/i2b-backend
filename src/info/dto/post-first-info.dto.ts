import { IsString, IsNumber, IsOptional, Length } from "class-validator";
import { PickType } from "@nestjs/swagger";
import { ClientInfo } from "../entities/client-info.entity";
import { Column } from "typeorm";

export class ClientInfoDto extends ClientInfo {
  @Column({ nullable: true })
  @IsString()
  @Length(5)
  password?: string;
}
