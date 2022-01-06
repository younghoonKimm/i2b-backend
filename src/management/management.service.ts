import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { ManageMentCategoryDto } from "./dto/category.dto";
import {
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "./entities/category.entity";
import { DueDateEntity } from "./entities/dueDate.entity";
import { dueDateValue } from "src/config";

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

const createEntity = async (arr, parent, entity, price) => {
  for (let i = 0; i < arr.length; i++) {
    const nowData = arr[i];
    await entity.save(
      entity.create({
        ...nowData,
        parent: parent,
        children: mngValidateHiddenSeqNo(nowData.children),
        price,
      }),
    );
  }
};

//빈곳에 퍼센트 입력
const percent = {
  percentHigh: 0,
  percentMid: 0,
  percentLow: 0,
};

const defaultPrice = {
  highManPrice: 0,
  highManCount: 0,
  midManPrice: 0,
  midManCount: 0,
  lowManPrice: 0,
  lowManCount: 0,
};

const setPrecent = (length) =>
  new Array(length)
    .fill(percent)
    .map((value, index) => ({ ...value, month: index + 1 }));

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(ManageMentCategoryEntites)
    private readonly ManageMentCategoryEntites: Repository<ManageMentCategoryEntites>,
    @InjectRepository(ManageMentCategoryEntity)
    private readonly manageMentCategoryEntity: Repository<ManageMentCategoryEntity>,
    @InjectRepository(DueDateEntity)
    private readonly dueDateEntity: Repository<DueDateEntity>,
  ) {}

  async getAllDueDate() {
    return await this.dueDateEntity.find();
  }

  async registerDueDate(array: number[]) {
    const saveDueDate = (dueDate) =>
      this.dueDateEntity.save(
        this.dueDateEntity.create({
          projDueDateName: `${dueDate}개월`,
          projDueDateMonth: dueDate,
        }),
      );
    const dueDates = await this.dueDateEntity.find();

    if (dueDates.length > 0) {
      const dates = dueDates.map((value) => value.projDueDateMonth);
      const addDates = array.filter(
        (addDate) => !dates.find((date) => date === addDate),
      );

      for (let i = 0; i < dueDates.length; i++) {
        const dueDate = dueDates[i].projDueDateMonth;
        const isValue = array.find((value) => value === dueDate);
        if (isValue) {
          continue;
        } else {
          await this.dueDateEntity.delete({
            projDueDateMonth: dueDate,
          });
        }
      }

      if (addDates.length > 0) {
        for (let j = 0; j < addDates.length; j++) {
          saveDueDate(addDates[j]);
        }
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        const dueDate = array[i];
        await saveDueDate(dueDate);
      }
    }
  }
  // [3,6,12]
  emptyPriceArray() {
    return dueDateValue.reduce((acc: any, cur: any) => {
      acc.push({
        month: cur,
        ...defaultPrice,
        precent: setPrecent(cur),
      });
      return acc;
    }, []);
  }

  async registerPriceData(array: number[]) {
    const category = await this.ManageMentCategoryEntites.find();

    for (let k = 0; k < category.length; k++) {
      for (let l = 0; l < category[k].children.length; l++) {
        let newPrice = [];
        for (let m = 0; m < array.length; m++) {
          const keepPrice = category[k].children[l].price.find(
            (priceData) => priceData.month === array[m],
          );
          if (keepPrice) {
            newPrice = [...newPrice, keepPrice];
          } else {
            newPrice = [
              ...newPrice,
              {
                month: array[m],
                ...defaultPrice,
                precent: setPrecent(array[m]),
              },
            ];
          }
          await this.manageMentCategoryEntity.save({
            ...category[k].children[l],
            price: newPrice,
          });
        }
      }
    }
  }

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
        const price = this.emptyPriceArray();

        return createEntity(
          noSeqNo,
          category,
          this.manageMentCategoryEntity,
          price,
        );
      }
    } else {
      const categoriesData = this.ManageMentCategoryEntites.save(
        this.ManageMentCategoryEntites.create(children),
      );

      const price = this.emptyPriceArray();

      return createEntity(
        children,
        categoriesData,
        this.manageMentCategoryEntity,
        price,
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

  async setPriceData(seqNo: string) {
    const category = await this.ManageMentCategoryEntites.findOne(
      { seqNo },
      { relations: ["children"] },
    );

    for (let i = 0; i < category.children.length; i++) {}

    return category;
  }
}
