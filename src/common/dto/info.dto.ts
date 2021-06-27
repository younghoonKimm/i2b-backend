import { IsString, IsNumber, IsOptional, Length } from "class-validator";
import { PickType } from "@nestjs/swagger";
import { Column } from "typeorm";
import { InfoEntity } from "../entities/info.entity";

export class InfoDto extends InfoEntity {}
