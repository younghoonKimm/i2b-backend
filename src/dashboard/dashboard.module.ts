import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InfoEntity } from "src/common/entities/info.entity";
import { DashboardController } from "./dashboard.controller";
import { DashBoardService } from "./dashboard.service";

@Module({
  imports: [TypeOrmModule.forFeature([InfoEntity])],
  controllers: [DashboardController],
  providers: [DashBoardService],
  exports: [DashBoardService],
})
export class DashboardModule {}
