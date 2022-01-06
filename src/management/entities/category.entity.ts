import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IsString, IsNumber } from "class-validator";

export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsNumber()
  order: number;

  @Column({ default: false })
  isHidden: boolean;
}

class PercentsDto {
  @Column()
  @IsNumber()
  month: number;

  @Column()
  @IsNumber()
  percentHigh: number;

  @Column()
  @IsNumber()
  percentMid: number;

  @Column()
  @IsNumber()
  percentLow: number;
}

class CategoryPriceDto {
  @PrimaryGeneratedColumn("uuid")
  dueSeqNo: string;

  @Column()
  @IsNumber()
  month: number;

  @Column()
  @IsNumber()
  highManPrice: number;

  @Column()
  @IsNumber()
  highManCount: number;

  @Column()
  @IsNumber()
  midManPrice: number;

  @Column()
  @IsNumber()
  midManCount: number;

  @Column()
  @IsNumber()
  lowManPrice: number;

  @Column()
  @IsNumber()
  lowManCount: number;

  @Column()
  @IsString()
  percent: PercentsDto[];
}

@Entity()
export class ManageMentCategoryEntites extends CategoryEntity {
  @OneToMany(() => ManageMentCategoryEntity, (category) => category.parent, {
    onDelete: "CASCADE",
    eager: true,
  })
  children: ManageMentCategoryEntity[];
}

@Entity()
export class ManageMentCategoryEntity extends CategoryEntity {
  @ManyToOne(() => ManageMentCategoryEntites, (parent) => parent.children)
  parent: ManageMentCategoryEntites;

  @Column("jsonb", { nullable: true })
  price: CategoryPriceDto[];

  @Column("jsonb", { nullable: true })
  children: CategoryEntity[];
}
