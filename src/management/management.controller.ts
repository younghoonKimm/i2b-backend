import { Controller, Post, UseGuards, Param, Body, Get } from "@nestjs/common";
import { ManagementService } from "./management.service";
import { AdminAuthGuards } from "src/auth/auth.guard";
import { AdminAuthUser } from "src/auth/auth-user.decorator";
import { JwtService } from "src/jwt/jwt.service";
import { ManageMentCategoryDto } from "./dto/category.dto";
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from "src/middlewares/auth.middleware";
import { Token } from "src/decorator/admin.decorator";

@Controller("mng")
export class MangaeMentController {
  constructor(private manageMentService: ManagementService) {}

  @UseGuards(AuthGuard)
  @Get("/categories")
  async getCategoryParent() {
    return this.manageMentService.getAllParentData();
  }

  @UseGuards(AuthGuard)
  @Get("/categories/:seqNo?")
  async getCategoryChildren(@Param("seqNo") seqNo?: any) {
    return this.manageMentService.getChildData(seqNo);
  }

  @UseGuards(AuthGuard)
  @Post("/categories/:seqNo?")
  async saveCategoryData(
    @Body()
    data: ManageMentCategoryDto[],
    @Param("seqNo") seqNo?: any,
  ) {
    return this.manageMentService.saveCategoryData(data, seqNo);
  }

  @UseGuards(AuthGuard)
  @Get("/categories/:seqNo/Price")
  async getPriceData(@Param("seqNo") seqNo: string) {
    return this.manageMentService.getPriceData(seqNo);
  }

  @UseGuards(AuthGuard)
  @Get("/mng/duedate")
  async getDueDate(@Param("seqNo") seqNo: string) {
    return this.manageMentService.getPriceData(seqNo);
  }
}
