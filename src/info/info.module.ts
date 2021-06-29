import { Module } from "@nestjs/common";
import { InfoController } from "./info.controller";
import { InfoService } from "./info.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InfoEntity } from "src/common/entities/info.entity";
import { ClientInfoEntity } from "./entities/client-info.entity";
import { BaseInfoEntity } from "./entities/base-info.entity";
import { DetailInfo } from "./entities/detail-info.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InfoEntity,
      ClientInfoEntity,
      BaseInfoEntity,
      DetailInfo,
    ]),
  ],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
