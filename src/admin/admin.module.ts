import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminInfoEntity } from "./entities/admin-info.entity";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AdminInfoEntity])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
