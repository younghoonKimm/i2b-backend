import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ManageMentCategoryEntites,
  CategoryEntity,
  ManageMentCategoryEntity,
} from "./entities/category.entity";
import { Repository } from "typeorm";
import { ManageMentCategoryDto } from "./dto/category.dto";
import { v4 as uuidv4 } from "uuid";

const mngValidateHiddenSeqNo = (array) => {
  return array.reduce((acc, cur) => {
    if (cur.isHidden === undefined || cur.isHidden === null)
      cur.isHidden = false;
    if (cur.seqNo === undefined || cur.seqNo === null) cur.seqNo = uuidv4();
    acc.push(cur);
    return acc;
  }, []);
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
    const childData = await this.ManageMentCategoryEntites.findOne({ seqNo });

    if (childData) return [childData];
  }

  async saveCategoryData(data: ManageMentCategoryDto, seqNo?: any) {
    if (seqNo) {
      const category = await this.ManageMentCategoryEntites.findOne(
        { seqNo },
        { relations: ["children"] },
      );
      return category;

      //   if (category) {
      //     return await this.managementCategory.save(category);
      //   }
    }

    const categoriesData = await this.ManageMentCategoryEntites.save(
      this.ManageMentCategoryEntites.create(data),
    );

    for (let i = 0; i < data.children.length; i++) {
      const nowData = data.children[i];
      await this.manageMentCategoryEntity.save(
        this.manageMentCategoryEntity.create({
          ...nowData,
          parent: categoriesData,
          children: mngValidateHiddenSeqNo(nowData.children),
        }),
      );
    }
  }
}
