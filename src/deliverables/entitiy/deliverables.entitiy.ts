import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { PickType } from "@nestjs/swagger";
import { CategoryEntity } from "src/management/entities/category.entity";

export class DeliverLists extends PickType(CategoryEntity, ["seqNo"]) {
  @Column()
  checkedName: string[];
}

@Entity()
export class DeliverablesEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  deliverable: string;

  @Column("jsonb", { nullable: true })
  //   @ApiProperty()
  deliverablesLists: DeliverLists[];
}
