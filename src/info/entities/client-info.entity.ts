import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, Length } from "class-validator";
import { InfoEntity } from "src/common/entities/info.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class ClientInfoEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsString()
  @Length(2, 20)
  @ApiProperty({
    example: "olivestone",
  })
  companyName: string;

  @Column()
  @IsString()
  @ApiProperty({
    example: "olivestonlab##",
  })
  clientEmail: string;

  @Column({ nullable: true })
  @IsString()
  @Length(2, 30)
  @ApiProperty({
    example: "wwww.naver.com",
  })
  companyWebSite: string;

  @Column()
  @IsString()
  @Length(2, 20)
  @ApiProperty({
    example: "olive",
  })
  clientName: string;

  @Column({ nullable: true })
  @IsString()
  @ApiProperty({
    example: "이사",
  })
  clientPosition: string;

  @Column()
  @IsString()
  @ApiProperty({
    example: "010-5195-4440",
  })
  clientNumber: string;

  @OneToOne(() => InfoEntity, (infoEntity) => infoEntity.clientInfo, {
    onDelete: "CASCADE",
  })
  info: InfoEntity;
}
