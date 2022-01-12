import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsDate, IsNumber, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class ScheduleInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  @ApiProperty({
    example: 1600000000,
  })
  projectStartDate: number;

  @Column()
  @IsNumber()
  @Min(0)
  @Max(4)
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
}
