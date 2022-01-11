import {
  CategoryEntity,
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "../entities/category.entity";
import { PrimaryGeneratedColumn } from "typeorm";
import { PickType, ApiProperty } from "@nestjs/swagger";
import { exampleManagementChildren } from "src/config";

export class ManageMentCategoryDto extends CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @ApiProperty(exampleManagementChildren)
  children?: ManageMentCategoryEntity[];
}

export class ManageMentSetPriceInput extends PickType(
  ManageMentCategoryEntites,
  ["children"],
) {}
