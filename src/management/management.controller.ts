import { Controller, Post, UseGuards, Param, Body, Get } from "@nestjs/common";
import { ManagementService } from "./management.service";
import {
  ManageMentSetPriceInput,
  ManagementParentOutput,
  ManageMentSetPriceOutput,
  ManageMentSetDataInput,
  ManagementAllOutput,
} from "./dto/category.dto";

import { AuthGuard } from "src/middlewares/auth.middleware";
import { dueDateValue } from "src/config";
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { DueDateEntity } from "./entities/dueDate.entity";

@Controller("mng")
@ApiTags("Management")
export class MangaeMentController {
  constructor(private manageMentService: ManagementService) {
    this.manageMentService.registerDueDate(dueDateValue);
    this.manageMentService.registerPriceData(dueDateValue);
    this.manageMentService.registerPMData(dueDateValue);
  }

  @UseGuards(AuthGuard)
  @Get("/duedate")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "개월 수 반환", description: "" })
  // @ApiCreatedResponse({ description: "get Due Date" })
  @ApiCreatedResponse({
    description: "Success",
    type: [DueDateEntity],
  })
  async getDueDate(): Promise<DueDateEntity[]> {
    return this.manageMentService.getAllDueDate();
  }

  @UseGuards(AuthGuard)
  @Get("/allcategories")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "카테고리 반환", description: "" })
  @ApiCreatedResponse({
    description: "Success",
    type: [ManagementAllOutput],
  })
  async getAllCategories(): Promise<ManagementAllOutput[]> {
    return this.manageMentService.getAllCategoryData();
  }

  @UseGuards(AuthGuard)
  @Get("/categories")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "카테고리 반환", description: "" })
  @ApiCreatedResponse({
    description: "Success",
    type: [ManagementParentOutput],
  })
  async getCategoryParent(): Promise<ManagementParentOutput[]> {
    return this.manageMentService.getAllCategoryParentData();
  }

  @UseGuards(AuthGuard)
  @Get("/categories/:seqNo?")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({
    summary: "카테고리 세부 항목",
    description: "seqNo는 최상위 부모값",
  })
  async getCategoryChildren(@Param("seqNo") seqNo?: string) {
    return this.manageMentService.getCategoryChildData(seqNo);
  }

  @UseGuards(AuthGuard)
  @Post("/categories/:seqNo?")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({
    summary: "카테고리 세부 항목 수정",
    description: "seqNo는 최상위 부모값",
  })
  @ApiCreatedResponse({
    description: "Sucess",
    type: ManageMentSetPriceOutput,
  })
  async saveCategoryData(
    @Body()
    data: ManageMentSetDataInput,
    @Param("seqNo") seqNo?: string,
  ): Promise<ManageMentSetPriceOutput> {
    return this.manageMentService.saveCategoryData(data, seqNo);
  }

  @UseGuards(AuthGuard)
  @Post("/categories/:seqNo/price")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "카테고리 세부 가격 수정", description: "" })
  async setPriceData(
    @Body()
    data: ManageMentSetPriceInput,
    @Param("seqNo") seqNo: string,
  ) {
    return this.manageMentService.setPriceData(data, seqNo);
  }

  @UseGuards(AuthGuard)
  @Get("/pm")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "PM Data 불러오기", description: "" })
  async getPriceData() {
    return this.manageMentService.getPMData();
  }

  @UseGuards(AuthGuard)
  @Post("/pm")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "PM Data 불러오기", description: "" })
  async setPMData(@Body() data: any) {
    return this.manageMentService.setPMData(data);
  }
}
