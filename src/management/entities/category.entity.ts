import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IsString, IsNumber, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { exampleManagementChildren } from "src/config";

export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({
    example: "e100e497-414f-4259-81ca-975e8b161701",
  })
  seqNo: string;

  @Column()
  @IsString()
  @ApiProperty({
    example: "UI/UX 전략",
  })
  name: string;

  @Column()
  @IsNumber()
  @ApiProperty({
    example: 0,
  })
  order: number;

  @Column({ default: false })
  @ApiProperty({
    example: false,
  })
  isHidden: boolean;
}

class PercentsDto {
  @Column()
  @IsNumber()
  @ApiProperty()
  month: number;

  @Column()
  @IsNumber()
  @Max(100)
  @ApiProperty()
  percentHigh: number;

  @Column()
  @IsNumber()
  @Max(100)
  @ApiProperty()
  percentMid: number;

  @Column()
  @IsNumber()
  @Max(100)
  @ApiProperty()
  percentLow: number;
}

class CategoryPriceDto {
  @PrimaryGeneratedColumn("uuid")
  dueSeqNo: string;

  @Column()
  @IsNumber()
  @ApiProperty()
  month: number;

  @Column()
  @IsNumber()
  @ApiProperty()
  highManPrice: number;

  @Column()
  @IsNumber()
  @ApiProperty()
  highManCount: number;

  @Column()
  @IsNumber()
  @ApiProperty()
  midManPrice: number;

  @Column()
  @IsNumber()
  @ApiProperty()
  midManCount: number;

  @Column()
  @IsNumber()
  @ApiProperty()
  lowManPrice: number;

  @Column()
  @IsNumber()
  @ApiProperty()
  lowManCount: number;

  @Column()
  @IsString()
  @ApiProperty()
  percent: PercentsDto[];
}

@Entity()
export class ManageMentCategoryEntites extends CategoryEntity {
  @OneToMany(() => ManageMentCategoryEntity, (category) => category.parent, {
    onDelete: "CASCADE",
    eager: true,
  })
  @ApiProperty(exampleManagementChildren)
  children: ManageMentCategoryEntity[];
}

@Entity()
export class ManageMentCategoryEntity extends CategoryEntity {
  @ManyToOne(() => ManageMentCategoryEntites, (parent) => parent.children)
  parent: ManageMentCategoryEntites;

  @Column("jsonb", { nullable: true })
  @ApiProperty()
  price: CategoryPriceDto[];

  @Column("jsonb", { nullable: true })
  @ApiProperty()
  children: CategoryEntity[];
}
