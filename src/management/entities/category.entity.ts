import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IsString, IsNumber, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @Column()
  @IsString()
  @ApiProperty()
  name: string;

  @Column()
  @IsNumber()
  @ApiProperty()
  order: number;

  @Column({ default: false })
  @ApiProperty()
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
  @ApiProperty({
    example: {
      seqNo: "6ab245ff-db88-419a-ad9e-96d95b825ec9",
      name: "dummy",
      order: 0,
      isHidden: false,
      price: [
        {
          month: 3,
          precent: [
            {
              month: 1,
              percentLow: 60,
              percentMid: 60,
              percentHigh: 0,
            },
            {
              month: 2,
              percentLow: 0,
              percentMid: 0,
              percentHigh: 0,
            },
            {
              month: 3,
              percentLow: 0,
              percentMid: 0,
              percentHigh: 0,
            },
          ],
          lowManCount: 0,
          lowManPrice: 0,
          midManCount: 0,
          midManPrice: 0,
          highManCount: 0,
          highManPrice: 0,
        },
      ],
    },
  })
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
