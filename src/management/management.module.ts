import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "./entities/category.entity";
import { MangaeMentController } from "./management.controller";
import { ManagementService } from "./management.service";
import { AdminInfoEntity } from "src/admin/entities/admin-info.entity";
import { DueDateEntity } from "./entities/dueDate.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ManageMentCategoryEntites,
      ManageMentCategoryEntity,
      DueDateEntity,
    ]),
  ],
  controllers: [MangaeMentController],
  providers: [ManagementService],
  exports: [ManageMentModule],
})
export class ManageMentModule {}
