import {
  CategoryEntity,
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "../entities/category.entity";
import { PrimaryGeneratedColumn } from "typeorm";
import { PickType, ApiProperty, OmitType } from "@nestjs/swagger";
import {
  exampleManagementChildren,
  exampleManagementPriceChildren,
  exampleManagementSetChildren,
} from "src/config";
import { CommonOutPut } from "src/common/dto/common.dto";

export class ManageMentCategoryDto extends CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @ApiProperty(exampleManagementChildren)
  children?: ManageMentCategoryEntity[];
}

class ManageMentSetPriceInputChildrenDto extends PickType(
  ManageMentCategoryEntity,
  ["seqNo", "price"],
) {}

class ManageMentSetDataInputChildrenDto extends OmitType(
  ManageMentCategoryEntity,
  ["price"],
) {}

export class ManageMentSetDataInput {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @ApiProperty(exampleManagementSetChildren)
  children?: ManageMentSetDataInputChildrenDto[];
}

export class ManageMentSetPriceInput {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @ApiProperty(exampleManagementPriceChildren)
  children?: ManageMentSetPriceInputChildrenDto[];
}

export class ManageMentSetPriceOutput extends CommonOutPut {}

export class ManagementParentOutput extends PickType(
  ManageMentCategoryEntites,
  ["name", "isHidden", "order"],
) {}

export class ManagementAllOutput extends PickType(ManageMentCategoryEntites, [
  "name",
  "isHidden",
  "order",
  "children",
]) {}
