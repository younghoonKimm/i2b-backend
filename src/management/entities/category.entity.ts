import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsNumber } from "class-validator";

export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  seqNo: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsNumber()
  order: number;

  @Column({ default: false })
  isHidden: boolean;
}

@Entity()
export class ManageMentCategoryEntity extends CategoryEntity {
  @Column("jsonb", { default: [] })
  children: CategoryEntity[];
}
