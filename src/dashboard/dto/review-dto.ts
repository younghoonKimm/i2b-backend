import { PickType, PartialType } from "@nestjs/swagger";
import { ReviewEntity } from "src/info/entities/review.entitiy";
import { AllSearchOutputData } from "./info-end.dto";

class ReviewOutput extends PickType(PartialType(ReviewEntity), [
  "record",
  "review",
  "updateAt",
]) {}

export class AllReviewOutput extends AllSearchOutputData {
  reviewData?: ReviewOutput[];

  error?: string;
}
