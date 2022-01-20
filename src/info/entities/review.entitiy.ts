import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsNumber, Min, Max } from "class-validator";
import { InfoEntity } from "src/common/entities/info.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class ReviewEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({
    example: 1,
  })
  record: number;

  @Column()
  @IsString()
  @Max(300)
  @ApiProperty({
    example: "리뷰 등록",
  })
  review: string;

  @OneToOne(() => InfoEntity, (infoEntity) => infoEntity.review, {
    onDelete: "CASCADE",
  })
  info: InfoEntity;
}
