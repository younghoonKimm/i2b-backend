import { Controller, Post, UseGuards, Param, Body, Get } from "@nestjs/common";
import { ManagementService } from "./management.service";
import { AdminAuthGuards } from "src/auth/auth.guard";
import { AdminAuthUser } from "src/auth/auth-user.decorator";
import { JwtService } from "src/jwt/jwt.service";
import {
  ManageMentCategoryDto,
  ManageMentCategoryEntityInput,
} from "./dto/category.dto";
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from "src/middlewares/auth.middleware";
import { Token } from "src/decorator/admin.decorator";
import { dueDateValue } from "src/config";
import { ManageMentCategoryEntites } from "./entities/category.entity";
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

@Controller("mng")
@ApiTags("Management")
export class MangaeMentController {
  constructor(private manageMentService: ManagementService) {
    this.manageMentService.registerDueDate(dueDateValue);
    this.manageMentService.registerPriceData(dueDateValue);
  }

  @UseGuards(AuthGuard)
  @Get("/duedate")
  @ApiBearerAuth()
  @ApiOperation({ summary: "개월 수 반환", description: "" })
  // @ApiCreatedResponse({ description: "get Due Date" })
  async getDueDate() {
    return this.manageMentService.getAllDueDate();
  }

  @UseGuards(AuthGuard)
  @Get("/categories")
  @ApiBearerAuth()
  @ApiOperation({ summary: "카테고리 반환", description: "" })
  async getCategoryParent() {
    return this.manageMentService.getAllParentData();
  }

  @UseGuards(AuthGuard)
  @Get("/categories/:seqNo?")
  @ApiBearerAuth()
  @ApiOperation({ summary: "카테고리 세부 항목", description: "" })
  async getCategoryChildren(@Param("seqNo") seqNo?: string) {
    return this.manageMentService.getChildData(seqNo);
  }

  @UseGuards(AuthGuard)
  @Post("/categories/:seqNo?")
  @ApiBearerAuth()
  @ApiOperation({ summary: "카테고리 세부 항목 수정", description: "" })
  async saveCategoryData(
    @Body()
    data: ManageMentCategoryDto,
    @Param("seqNo") seqNo?: string,
  ) {
    return this.manageMentService.saveCategoryData(data, seqNo);
  }

  @UseGuards(AuthGuard)
  @Get("/categories/:seqNo/Price")
  @ApiBearerAuth()
  @ApiOperation({ summary: "카테고리 세부 가격", description: "" })
  async getPriceData(@Param("seqNo") seqNo?: string) {
    return this.manageMentService.getPriceData(seqNo);
  }

  @UseGuards(AuthGuard)
  @Post("/categories/:seqNo/Price")
  @ApiBearerAuth()
  @ApiOperation({ summary: "카테고리 세부 가격 수정", description: "" })
  async setPriceData(
    @Body()
    data: ManageMentCategoryEntityInput,
    @Param("seqNo") seqNo: string,
  ) {
    return this.manageMentService.setPriceData(data, seqNo);
  }
}
