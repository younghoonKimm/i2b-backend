import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IsString, IsNumber } from "class-validator";

class PercentsEntity {
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

@Entity()
export class CategoryPriceEntity {
  @PrimaryGeneratedColumn("uuid")
  dueSeqNo: string;

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
  percent: PercentsEntity[];
}
