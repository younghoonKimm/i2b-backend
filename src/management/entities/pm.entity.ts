import { PickType, ApiProperty } from "@nestjs/swagger";
import { CategoryEntity, CategoryPriceDto } from "./category.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber, IsString } from "class-validator";

@Entity()
export class PMEntity extends PickType(CategoryEntity, ["name"]) {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({
    example: "e100e497-414f-4259-81ca-975e8b161701",
  })
  seqNo: string;

  @Column({ default: "PM" })
  @IsString()
  @ApiProperty({
    example: "PM",
  })
  name: string;

  @Column({ default: 1 })
  @ApiProperty()
  @IsNumber()
  defaultCount: number;

  @Column("jsonb", { nullable: true })
  @ApiProperty()
  price?: CategoryPriceDto[];
}
