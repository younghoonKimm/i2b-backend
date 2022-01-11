import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";
import { IsBoolean } from "class-validator";

export class CommonOutPut {
  @ApiProperty({
    example: true,
  })
  @Column()
  @IsBoolean()
  success?: boolean;

  @ApiProperty({
    example: "error",
  })
  @Column()
  @IsBoolean()
  error?: string;
}
