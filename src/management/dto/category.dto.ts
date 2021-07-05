import { CategoryEntity } from "../entities/category.entity";
import { PrimaryGeneratedColumn, Column } from "typeorm";

export class ManageMentCategoryDto {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  children: any;
}
