import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "./entities/category.entity";
import { Repository } from "typeorm";
import { ManageMentCategoryDto } from "./dto/category.dto";
import { v4 as uuidv4 } from "uuid";

const mngValidateHiddenSeqNo = (array) => {
  if (array.length > 0) {
    return array.reduce((acc, cur) => {
      if (cur.isHidden === undefined || cur.isHidden === null)
        cur.isHidden = false;
      if (!cur.seqNo) cur.seqNo = uuidv4();
      acc.push(cur);
      return acc;
    }, []);
  }
};

const createEntity = async (arr, parent, entity) => {
  for (let i = 0; i < arr.length; i++) {
    const nowData = arr[i];
    await entity.save(
      entity.create({
        ...nowData,
        parent: parent,
        children: mngValidateHiddenSeqNo(nowData.children),
      }),
    );
  }
};

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(ManageMentCategoryEntites)
    private readonly ManageMentCategoryEntites: Repository<ManageMentCategoryEntites>,
    @InjectRepository(ManageMentCategoryEntity)
    private readonly manageMentCategoryEntity: Repository<ManageMentCategoryEntity>,
  ) {}

  async getAllParentData() {
    return await this.ManageMentCategoryEntites.find();
  }

  async getChildData(seqNo: string) {
    const childData = await this.ManageMentCategoryEntites.findOne(
      { seqNo },
      { relations: ["children"] },
    );

    if (childData) return childData.children;
  }

  async saveCategoryData({ children }: ManageMentCategoryDto, seqNo?: string) {
    if (seqNo) {
      const category = await this.ManageMentCategoryEntites.findOne(
        { seqNo },
        { relations: ["children"] },
      );

      const noSeqNo = children.filter((v) => v.seqNo === undefined);

      if (category.children) {
        for (let i = 0; i < category.children.length; i++) {
          const isCategory = children.find(
            (children) => children.seqNo === category.children[i].seqNo,
          );
          if (isCategory) {
            await this.manageMentCategoryEntity.save({
              ...category.children[i],
              ...isCategory,
            });
          } else {
            await this.manageMentCategoryEntity.delete({
              seqNo: category.children[i].seqNo,
            });
          }
        }
      }

      await this.ManageMentCategoryEntites.save(category);

      if (noSeqNo.length > 0) {
        return createEntity(noSeqNo, category, this.manageMentCategoryEntity);
      }
    } else {
      const categoriesData = await this.ManageMentCategoryEntites.save(
        this.ManageMentCategoryEntites.create(children),
      );
      return createEntity(
        children,
        categoriesData,
        this.manageMentCategoryEntity,
      );
    }
  }

  async getPriceData(seqNo: string) {
    const category = await this.ManageMentCategoryEntites.findOne(
      { seqNo },
      { relations: ["children"] },
    );

    return category;
  }
}
