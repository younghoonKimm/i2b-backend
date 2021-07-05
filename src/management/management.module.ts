import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "./entities/category.entity";
import { MangaeMentController } from "./management.controller";
import { ManagementService } from "./management.service";
import { AdminInfoEntity } from "src/admin/entities/admin-info.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ManageMentCategoryEntites,
      ManageMentCategoryEntity,
    ]),
  ],
  controllers: [MangaeMentController],
  providers: [ManagementService],
  exports: [ManageMentModule],
})
export class ManageMentModule {}
