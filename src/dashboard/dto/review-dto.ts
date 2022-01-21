import { PickType, PartialType } from "@nestjs/swagger";
import { ReviewEntity } from "src/info/entities/review.entitiy";

class ReviewOutput extends PickType(PartialType(ReviewEntity), [
  "record",
  "id",
]) {}

export class AllReviewOutput {
  reviewData?: ReviewOutput[];

  error?: string;
}
