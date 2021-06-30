import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsNumber, IsBoolean, IsArray } from "class-validator";

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

@Entity()
export class ManageMentCategoryEntity extends CategoryEntity {
  @Column("jsonb", { default: [] })
  children: CategoryEntity[];
}
