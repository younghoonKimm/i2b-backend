import { PickType, ApiProperty } from "@nestjs/swagger";
import { InfoEntity } from "../entities/info.entity";

export class InfoDto extends PickType(InfoEntity, [
  "status",
  "clientInfo",
  "baseInfo",
  "detailInfo",
  "scheduleInfo",
  "review",
]) {
  @ApiProperty({
    example: "dev.olivestonelab.com",
  })
  clientEmail?: string;

  @ApiProperty({
    example: "olivestonlab##",
  })
  password?: string;
}
