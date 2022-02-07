import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliverablesEntity } from "./entitiy/deliverables.entitiy";
import { DeliverablesService } from "./deliverables.service";
import { DeliverableController } from "./deliverables.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DeliverablesEntity])],
  controllers: [DeliverableController],
  providers: [DeliverablesService],
  exports: [DeliverablesService],
})
export class DeliverablesModule {}
