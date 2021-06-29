import { IsString, Length, IsBoolean } from "class-validator";
import { ClientInfoEntity } from "../entities/client-info.entity";
import { Column } from "typeorm";

export class ClientInfoDto extends ClientInfoEntity {
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
