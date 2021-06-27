import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, Length } from "class-validator";
import { InfoEntity } from "src/common/entities/info.entity";

@Entity()
export class DetailInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(0, 100)
  projectName: string;

  @Column({ nullable: true })
  @IsString()
  @Length(0, 6000)
  companyWebSite: string;

  @OneToOne(() => InfoEntity, (infoEntity) => infoEntity.clientInfo)
  info: InfoEntity;
}
