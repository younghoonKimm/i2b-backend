import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";
import { IsBoolean } from "class-validator";

export class CommonOutPut {
  @ApiProperty()
  @Column()
  @IsBoolean()
  success?: boolean;

  @ApiProperty()
  @Column()
  @IsBoolean()
  error?: string;
}
