import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { IsString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class DueDateEntity {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty()
  projDueDateSeqNo: number;

  @Column()
  @IsString()
  @ApiProperty()
  projDueDateName: string;

  @Column()
  @IsNumber()
  @ApiProperty({ example: 3 })
  projDueDateMonth: number;
}
