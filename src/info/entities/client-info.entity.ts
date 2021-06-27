import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, Length } from "class-validator";
import { InfoEntity } from "src/common/entities/info.entity";

@Entity()
export class ClientInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(2, 20)
  companyName: string;

  @Column()
  @IsString()
  clientEmail: string;

  @Column({ nullable: true })
  @IsString()
  @Length(2, 30)
  companyWebSite: string;

  @Column()
  @IsString()
  @Length(2, 20)
  clientName: string;

  @Column({ nullable: true })
  @IsString()
  clientPosition: string;

  @Column()
  @IsString()
  clientNumber: string;

  @OneToOne(() => InfoEntity, (infoEntity) => infoEntity.baseInfo)
  info: InfoEntity;
}
