import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliverablesEntity } from "./entitiy/deliverables.entitiy";

@Module({
  imports: [TypeOrmModule.forFeature([DeliverablesEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class DeliverablesModule {}
