import { Controller, Post, Body, Put, UseGuards, Get } from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  AdminCreateInputDto,
  AdminCreateOutputDto,
  AdminMeOutPutDto,
} from "./dto/admin-info.dto";
import { AdminLoginInput, AdminLoginOutput } from "./dto/admin-login.dto";
import { AdminEditInput, AdminEditOutput } from "./dto/admin-edit.dto";
import { AuthGuard } from "src/middlewares/auth.middleware";
import { Token } from "src/decorator/admin.decorator";
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";

@Controller("admin")
@ApiTags("Admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post("/create")
  @ApiOperation({ summary: "Admin 관리자 생성", description: "" })
  @ApiCreatedResponse({
    description: "Success",
    type: AdminCreateOutputDto,
  })
  createAdminUser(
    @Body() adminInfo: AdminCreateInputDto,
  ): Promise<AdminCreateOutputDto> {
    return this.adminService.createAdminUser(adminInfo);
  }

  @Post("/login")
  @ApiBody({ type: AdminLoginInput })
  @ApiOperation({ summary: "Admin 관리자 로그인", description: "" })
  @ApiCreatedResponse({
    description: "Success",
    type: AdminLoginOutput,
  })
  loginAdminUser(
    @Body() adminLoginInput: AdminLoginInput,
  ): Promise<AdminLoginOutput> {
    return this.adminService.loginAdminUser(adminLoginInput);
  }

  @UseGuards(AuthGuard)
  @Post("/me")
  @ApiOperation({ summary: "Admin 관리자 정보 수정", description: "" })
  @ApiBearerAuth("bearerAuth")
  @ApiCreatedResponse({
    description: "Success",
    type: AdminEditOutput,
  })
  editAdminUser(
    @Token() token: any,
    @Body() adminEditInput: AdminEditInput,
  ): Promise<AdminEditOutput> {
    return this.adminService.editAdminUser(token, adminEditInput);
  }
  // @ApiHeader({ name: "Bearer" })
  @UseGuards(AuthGuard)
  @Get("/me")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "Admin 관리자 정보", description: "" })
  @ApiCreatedResponse({
    description: "Success",
    type: AdminMeOutPutDto,
  })
  getUserInfo(@Token() token: any): Promise<AdminMeOutPutDto> {
    return this.adminService.getUserInfo(token);
  }
}
