import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsNumber, Length } from "class-validator";
import { InfoEntity } from "src/common/entities/info.entity";

@Entity()
export class BaseInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  projectType: number;

  @Column()
  @IsNumber()
  projectStatus: number;

  @Column({ nullable: true })
  @IsString()
  targetDevice: string;

  @OneToOne(() => InfoEntity, (infoEntity) => infoEntity.clientInfo)
  info: InfoEntity;
}
