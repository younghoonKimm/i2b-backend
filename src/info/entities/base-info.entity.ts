import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsNumber, Length, IsArray } from "class-validator";
import { InfoEntity } from "src/common/entities/info.entity";
import { required } from "joi";
import { ApiProperty } from "@nestjs/swagger";
import { RadioInput } from "src/common/dto/common.dto";

@Entity()
export class BaseInfoEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsNumber()
  @ApiProperty({
    example: 1,
  })
  projectType: number;

  @Column("int", { array: true })
  @IsNumber()
  @ApiProperty({
    example: [1],
  })
  projectStatus: RadioInput[];

  @Column({ nullable: true })
  @IsString()
  @ApiProperty({
    example: "string",
  })
  targetDevice?: string;

  // @Column("text", { array: true })
  // projectRequestLists: string[];

  @OneToOne(() => InfoEntity, (infoEntity) => infoEntity.clientInfo, {
    onDelete: "CASCADE",
  })
  info: InfoEntity;
}
