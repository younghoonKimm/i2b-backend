import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { ManageMentCategoryDto } from "./dto/category.dto";
import {
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "./entities/category.entity";
import { DueDateEntity } from "./entities/dueDate.entity";
import { dueDateValue } from "src/config";
import { date } from "joi";

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
    private connection: Connection,
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
    const dueDates = await this.dueDateEntity.find();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const saveDueDate = async (dueDate) => {
      const newDueDate = new DueDateEntity();

      newDueDate.projDueDateName = `${dueDate}개월`;
      newDueDate.projDueDateMonth = dueDate;
      await queryRunner.manager.save(newDueDate);
      await queryRunner.commitTransaction();
    };
    try {
      if (dueDates.length > 0) {
        const dates = dueDates.map((value) => value.projDueDateMonth);
        const addDates = array.filter(
          (addDate) => !dates.find((date) => date === addDate),
        );
        let deleteDates = [];
        for (let i = 0; i < dueDates.length; i++) {
          const dueDate = dueDates[i].projDueDateMonth;
          const isValue = array.find((value) => value === dueDate);
          if (isValue) {
            continue;
          } else {
            deleteDates.push(dueDate);
          }
        }

        // await this.dueDateEntity.delete({
        //   projDueDateMonth: deleteDates,
        // });
        // await this.dueDateEntity.delete({
        //   projDueDateMonth: dueDate,
        // });
        // delete({
        //   projDueDateMonth: +deleteDates.map((value) => value),
        // });

        // await this.dueDateEntity
        //   .createQueryBuilder()
        //   .from(this.dueDateEntity, "duedate")
        //   .where({ projDueDateMonth: +deleteDates.map((value) => value) })
        //   .execute();

        if (addDates.length > 0) {
          for (let j = 0; j < addDates.length; j++) {
            saveDueDate(addDates[j]);
          }
        }
        if (deleteDates) {
          await this.dueDateEntity
            .createQueryBuilder("due_date_entity")
            .where("projDueDateMonth = :projDueDateMonth", {
              projDueDateMonth: 15,
            })
            .delete()
            .execute();
        }
      } else {
        for (let i = 0; i < array.length; i++) {
          const dueDate = array[i];
          await saveDueDate(dueDate);
        }
      }
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
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
