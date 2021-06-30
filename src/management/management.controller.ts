import { Controller, Post, UseGuards, Param, Body, Get } from "@nestjs/common";
import { ManagementService } from "./management.service";
import { AdminAuthGuards } from "src/auth/auth.guard";
import { AdminAuthUser } from "src/auth/auth-user.decorator";
import { JwtService } from "src/jwt/jwt.service";
import { ManageMentCategoryDto } from "./dto/category.dto";
import { AuthService } from "src/auth/auth.service";

@Controller("mng")
export class MangaeMentController {
  constructor(
    private manageMentService: ManagementService,
    private readonly authService: AuthService,
  ) {}

  @Get("/categories")
  @UseGuards(AdminAuthGuards)
  async getCategoryParent(@AdminAuthUser() authUser: string) {
    const user = await this.authService.adminTokenValidate(authUser);
    if (!user) return false;
    return this.manageMentService.getAllParentData();
  }

  @Get("/categories/:seqNo?")
  @UseGuards(AdminAuthGuards)
  async getCategoryChildren(
    @AdminAuthUser() authUser: string,
    @Param("seqNo") seqNo?: any,
  ) {
    const user = await this.authService.adminTokenValidate(authUser);
    if (!user) return false;
    return this.manageMentService.getChildData(seqNo);
  }

  @Post("/categories/:seqNo?")
  @UseGuards(AdminAuthGuards)
  async saveCategoryData(
    @AdminAuthUser() authUser: string,
    @Body()
    data: ManageMentCategoryDto,
    @Param("seqNo") seqNo?: any,
  ) {
    const user = await this.authService.adminTokenValidate(authUser);
    if (!user) return false;
    console.log(data);
    return this.manageMentService.saveCategoryData(data, seqNo);
  }
}
