import { CategoryEntity } from "../entities/category.entity";
import { PrimaryGeneratedColumn, Column } from "typeorm";

export class ManageMentCategoryDto extends CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @Column("jsonb", { default: [] })
  children: CategoryEntity[];
}
