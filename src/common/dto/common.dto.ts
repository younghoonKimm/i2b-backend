import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";
import { IsBoolean, Max, Min } from "class-validator";

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

export class RadioInput {
  @Min(0)
  @Max(4)
  number: number;
}
