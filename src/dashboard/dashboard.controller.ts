import { Controller, Get, UseGuards, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DashBoardService } from "./dashboard.service";
import { AuthGuard } from "src/middlewares/auth.middleware";
import { AllSearchOutputData, EndInfoOutput } from "./dto/info-end.dto";
import { AllReviewOutput } from "./dto/review-dto";

@Controller("dashboard")
@ApiTags("dashboard")
export class DashboardController {
  constructor(private dashboardService: DashBoardService) {}

  @UseGuards(AuthGuard)
  @Get("")
  async getEndInfoData(): Promise<EndInfoOutput> {
    return this.dashboardService.getEndInfoData();
  }

  @UseGuards(AuthGuard)
  @Get("/search")
  async getSearchInfoData(
    @Body() searchData: any,
  ): Promise<AllSearchOutputData> {
    return this.dashboardService.getSearchata(searchData);
  }

  @UseGuards(AuthGuard)
  @Get("/review")
  async getReviewData(): Promise<AllReviewOutput> {
    return this.dashboardService.allReviewData();
  }
}
