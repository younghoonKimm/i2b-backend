import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsNumber, Length } from "class-validator";
import { CommonEntitiy } from "src/common/entities/common.entity";

@Entity()
export class adminInfoEntity extends CommonEntitiy {
  @Column()
  @IsNumber()
  projectType: number;

  @Column()
  @IsNumber()
  projectStatus: number;

  @Column({ nullable: true })
  @IsString()
  targetDevice: string;
}
