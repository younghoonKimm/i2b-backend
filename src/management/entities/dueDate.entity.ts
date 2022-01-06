import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { IsString, IsNumber } from "class-validator";

@Entity()
export class DueDateEntity {
  @PrimaryGeneratedColumn("uuid")
  projDueDateSeqNo: number;

  @Column()
  @IsString()
  projDueDateName: string;

  @Column()
  @IsNumber()
  projDueDateMonth: number;
}
