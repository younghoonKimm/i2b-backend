import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { IsDate, IsNumber, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InfoEntity } from "src/common/entities/info.entity";

@Entity()
export class ScheduleInfoEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsNumber()
  @ApiProperty({
    example: 1600000000,
  })
  projectStartDate: number;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(9)
  @ApiProperty({
    example: 1,
  })
  projectDueDate: number;

  @Column()
  @IsNumber()
  @Min(0)
  @Max(1)
  @ApiProperty({
    example: 1,
  })
  budgetType: number;

  @Column()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 1000000,
  })
  budget: number;

  @OneToOne(() => InfoEntity, (infoEntity) => infoEntity.scheduleInfo, {
    onDelete: "CASCADE",
  })
  info: InfoEntity;
}
