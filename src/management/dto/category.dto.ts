import {
  CategoryEntity,
  ManageMentCategoryEntites,
} from "../entities/category.entity";
import { PrimaryGeneratedColumn, Column } from "typeorm";
import { PickType } from "@nestjs/swagger";

export class ManageMentCategoryDto extends CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  children?: any;
}

export class ManageMentCategoryEntityInput extends PickType(
  ManageMentCategoryEntites,
  ["children"],
) {}
