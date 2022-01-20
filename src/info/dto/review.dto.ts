import { PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entitiy";

export class ReviewInputDto extends PickType(ReviewEntity, [
  "record",
  "review",
]) {}
