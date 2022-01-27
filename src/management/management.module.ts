import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "./entities/category.entity";
import { MangaeMentController } from "./management.controller";
import { ManagementService } from "./management.service";
import { DueDateEntity } from "./entities/dueDate.entity";
import { PMEntity } from "./entities/pm.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ManageMentCategoryEntites,
      ManageMentCategoryEntity,
      DueDateEntity,
      PMEntity,
    ]),
  ],
  controllers: [MangaeMentController],
  providers: [ManagementService],
  exports: [ManageMentModule],
})
export class ManageMentModule {}
