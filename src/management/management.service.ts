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
      if (cur.seqNo === undefined || cur.seqNo === null) cur.seqNo = uuidv4();
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

  async saveCategoryData(data: ManageMentCategoryDto[], seqNo?: any) {
    if (seqNo) {
      const category = await this.ManageMentCategoryEntites.findOne(
        { seqNo },
        { relations: ["children"] },
      );

      const noSeqNo = data.filter((v) => v.seqNo === undefined);

      // 기존 데이터 삭제 및 업데이트
      category.children.reduce(async (_: any, cur: any) => {
        const isCategory = data.find(
          (children) => children.seqNo === cur.seqNo,
        );
        if (isCategory) {
          await this.manageMentCategoryEntity.save({
            ...cur,
            ...isCategory,
          });
        } else {
          await this.manageMentCategoryEntity.delete({
            seqNo: cur.seqNo,
          });
        }
      }, []);

      await this.ManageMentCategoryEntites.save(category);

      if (noSeqNo.length > 0) {
        return createEntity(noSeqNo, category, this.manageMentCategoryEntity);
      }
    } else {
      const categoriesData = await this.ManageMentCategoryEntites.save(
        this.ManageMentCategoryEntites.create(data),
      );
      return createEntity(data, categoriesData, this.manageMentCategoryEntity);
    }
  }

  async getPriceData(seqNo: string) {}
}
