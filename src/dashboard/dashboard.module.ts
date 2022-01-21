import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InfoEntity } from "src/common/entities/info.entity";
import { DashboardController } from "./dashboard.controller";
import { DashBoardService } from "./dashboard.service";
import { ReviewEntity } from "src/info/entities/review.entitiy";

@Module({
  imports: [TypeOrmModule.forFeature([InfoEntity, ReviewEntity])],
  controllers: [DashboardController],
  providers: [DashBoardService],
  exports: [DashBoardService],
})
export class DashboardModule {}
