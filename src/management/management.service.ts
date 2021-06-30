import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ManageMentCategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { AdminInfoEntity } from "src/admin/entities/admin-info.entity";
import { AuthService } from "src/auth/auth.service";
import { ManageMentCategoryDto } from "./dto/category.dto";

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(ManageMentCategoryEntity)
    private readonly managementCategory: Repository<ManageMentCategoryEntity>,
  ) {}

  async getAllParentData() {
    return await this.managementCategory.find();
  }

  async getChildData(seqNo: string) {
    const childData = await this.managementCategory.findOne({ seqNo });

    if (childData) return [childData];
  }

  async saveCategoryData(data: ManageMentCategoryDto, seqNo?: any) {
    console.log(data);
    if (seqNo) {
      const category = await this.managementCategory.findOne({
        seqNo,
      });
      if (category) {
        category.children = [{ ...data }];
        return await this.managementCategory.save(category);
      }
    }
    return await this.managementCategory.save(
      this.managementCategory.create(data),
    );
  }
}
