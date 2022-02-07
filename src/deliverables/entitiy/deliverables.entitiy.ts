import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { PickType, ApiProperty } from "@nestjs/swagger";
import { CategoryEntity } from "src/management/entities/category.entity";
import { IsString } from "class-validator";

export class DeliverLists extends PickType(CategoryEntity, ["seqNo"]) {
  @Column()
  @IsString()
  parentSeqNo: string;

  @Column("jsonb", { nullable: true, default: [] })
  checkedNames?: string[];
}

@Entity()
export class DeliverablesEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  deliverable: string;

  @Column("jsonb", { default: [] })
  @ApiProperty()
  deliverablesLists: DeliverLists[];
}
