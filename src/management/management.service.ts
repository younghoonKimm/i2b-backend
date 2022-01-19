import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import {
  ManagementParentOutput,
  ManageMentSetPriceInput,
  ManageMentSetPriceOutput,
  ManageMentSetDataInput,
} from "./dto/category.dto";
import {
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "./entities/category.entity";
import { DueDateEntity } from "./entities/dueDate.entity";
import {
  dueDateValue,
  defaultPercent,
  defaultPrice,
  parentData,
} from "src/config";

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
const setPercent = (length) =>
  new Array(length)
    .fill(defaultPercent)
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

  async getAllDueDate(): Promise<DueDateEntity[]> {
    return await this.dueDateEntity.find();
  }

  async registerDueDate(array: number[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const dueDates = await queryRunner.query("SELECT * FROM due_date_entity");

    await queryRunner.startTransaction();

    //querymanger를 통한 dueDate 생성 method
    const saveDueDate = async (dueDate) => {
      const newDueDate = new DueDateEntity();

      newDueDate.projDueDateName = `${dueDate}개월`;
      newDueDate.projDueDateMonth = dueDate;
      await queryRunner.manager.save(newDueDate);
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
            // deleteDates.push(dueDate);
            await this.dueDateEntity.delete({
              projDueDateMonth: dueDate,
            });
          }
        }

        if (addDates.length > 0) {
          await Promise.all(addDates.map((value) => saveDueDate(value)));
          await queryRunner.commitTransaction();
        }
        //query manage를 통한 deleteDates 추가해야함
        // if (deleteDates) {
        //   console.log(deleteDates);
        //   await this.dueDateEntity
        //     .createQueryBuilder("due_date_entity")
        //     // .where(
        //     //   "projDueDateMonth = :projDueDateMonth",
        //     //   deleteDates.forEach((value) => {
        //     //     projDueDateMonth: value;
        //     //   }),
        //     // )
        //     // "projDueDateMonth = :projDueDateMonth"
        //     .where(
        //       deleteDates.map((value) => {
        //         projDueDateMonth: value;
        //       }),
        //     )
        //     .delete()
        //     .execute();
        // }
      } else {
        for (let i = 0; i < array.length; i++) {
          const dueDate = array[i];
          await saveDueDate(dueDate);
        }
        await queryRunner.commitTransaction();
      }
      await this.registerPriceData(dueDateValue);
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //기간 변경시 priceData 추가.
  emptyPriceArray() {
    return dueDateValue.reduce((acc: any, cur: any) => {
      acc.push({
        month: cur,
        ...defaultPrice,
        percent: setPercent(cur),
      });
      return acc;
    }, []);
  }

  async registerPriceData(array: number[]) {
    const categories = await this.ManageMentCategoryEntites.createQueryBuilder(
      "management_category_entites",
    )
      .leftJoinAndSelect("management_category_entites.children", "children")
      .getMany();

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all(
        categories.map(async (category) => {
          for (let l = 0; l < category.children.length; l++) {
            let newPrice = [];

            for (let m = 0; m < array.length; m++) {
              const keepPrice = category.children[l].price?.find(
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
                    percent: setPercent(array[m]),
                  },
                ];
              }

              await queryRunner.manager.save(ManageMentCategoryEntity, {
                ...category.children[l],
                price: newPrice,
              });
            }
          }
        }),
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getAllParentData(): Promise<ManagementParentOutput[]> {
    const categories = await this.ManageMentCategoryEntites.createQueryBuilder(
      "management_category_entites",
    ).getMany();

    return categories;
  }

  async getChildData(seqNo: string) {
    const childData = await this.ManageMentCategoryEntites.findOne(
      { seqNo },
      { relations: ["children"] },
    );
    if (childData) return childData.children;
  }

  async setParentData() {
    return parentData.forEach(async (value) => {
      await this.ManageMentCategoryEntites.save(
        this.ManageMentCategoryEntites.create({
          name: value.name,
          order: value.order,
        }),
      );
    });
  }

  async saveCategoryData(
    { children }: ManageMentSetDataInput,
    seqNo?: string,
  ): Promise<ManageMentSetPriceOutput> {
    try {
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

          await createEntity(
            noSeqNo,
            category,
            this.manageMentCategoryEntity,
            price,
          );

          return { success: true };
        }
      } else {
        const categoriesData = this.ManageMentCategoryEntites.save(
          this.ManageMentCategoryEntites.create(children),
        );

        const price = this.emptyPriceArray();

        await createEntity(
          children,
          categoriesData,
          this.manageMentCategoryEntity,
          price,
        );

        return { success: true };
      }
    } catch (error) {
      return { error };
    }
  }

  async getPriceData(seqNo: string) {
    const category = await this.ManageMentCategoryEntites.findOne(
      { seqNo },
      { relations: ["children"] },
    );

    return category;
  }

  async setPriceData(data: ManageMentSetPriceInput, seqNo: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.connection
        .getRepository(ManageMentCategoryEntites)
        .findOne({ seqNo }, { relations: ["children"] });

      await Promise.all(
        data.children.map(async (children) => {
          let newPrice = [];

          const beforeData = category.children.find(
            (child) => children.seqNo === child.seqNo,
          );

          for (let m = 0; m < dueDateValue.length; m++) {
            const keepPrice = children.price.find(
              (priceData) => priceData.month === dueDateValue[m],
            );

            if (keepPrice) {
              newPrice = [...newPrice, keepPrice];
            } else {
              newPrice = [
                ...newPrice,
                {
                  month: dueDateValue[m],
                  ...defaultPrice,
                  percent: setPercent(dueDateValue[m]),
                },
              ];
            }
          }
          await queryRunner.manager.save(ManageMentCategoryEntity, {
            ...beforeData,
            price: newPrice,
          });
        }),
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
