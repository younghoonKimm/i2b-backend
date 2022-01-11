import {
  CategoryEntity,
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "../entities/category.entity";
import { PrimaryGeneratedColumn } from "typeorm";
import { PickType, ApiProperty, PartialType, OmitType } from "@nestjs/swagger";
import { exampleManagementChildren } from "src/config";
import { CommonOutPut } from "src/common/dto/common.dto";

export class ManageMentCategoryDto extends CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @ApiProperty(exampleManagementChildren)
  children?: ManageMentCategoryEntity[];
}

export class ManageMentSetPriceInput extends PickType(ManageMentCategoryDto, [
  "children",
] as const) {}

export class ManageMentSetDataInput extends PickType(ManageMentCategoryDto, [
  "children",
] as const) {}

export class ManageMentSetPriceOutput extends CommonOutPut {}

export class ManagementParentOutput extends PickType(
  ManageMentCategoryEntites,
  ["name", "isHidden", "order"],
) {}
