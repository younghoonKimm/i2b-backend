import { Controller, Get, UseGuards, Body, Param } from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { DashBoardService } from "./dashboard.service";
import { AuthGuard } from "src/middlewares/auth.middleware";
import { AllSearchOutputData, EndInfoOutput } from "./dto/info-end.dto";
import { AllReviewOutput } from "./dto/review-dto";

@Controller("dashboard")
@ApiTags("dashboard")
export class DashboardController {
  constructor(private dashboardService: DashBoardService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth("bearerAuth")
  @Get("")
  async getEndInfoData(): Promise<EndInfoOutput> {
    return this.dashboardService.getEndInfoData();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({
    summary: "Dashboard 검색",
    description: "Dashboard 검색 정보",
  })
  @Get("/search/:page")
  async getSearchInfoData(
    @Param() { page }: { page: number },
    @Body() searchData: any,
  ): Promise<AllSearchOutputData> {
    return this.dashboardService.getSearchata(page, searchData);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({
    summary: "전체 리뷰 데이터",
    description: "리뷰 데이터",
  })
  @Get("/review/:page")
  async getReviewData(
    @Param() { page }: { page: number },
  ): Promise<AllReviewOutput> {
    return this.dashboardService.allReviewData(page);
  }
}
