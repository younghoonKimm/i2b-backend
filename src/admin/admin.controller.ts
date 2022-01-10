import { Controller, Post, Body, Put, UseGuards, Get } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminInfoInputDto } from "./dto/admin-info.dto";
import { AdminLoginInput } from "./dto/admin-login.dto";
import { AdminEditInput } from "./dto/admin-edit.dto";
import { AdminAuthUser } from "src/auth/auth-user.decorator";
import { AdminInfoEntity } from "./entities/admin-info.entity";
import { JwtService } from "src/jwt/jwt.service";
import { AuthGuard } from "src/middlewares/auth.middleware";
import { Token } from "src/decorator/admin.decorator";
import { ApiOperation, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

@Controller("admin")
@ApiTags("Admin")
export class AdminController {
  constructor(
    private adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  createAdminUser(@Body() adminInfo: AdminInfoInputDto) {
    return this.adminService.createAdminUser(adminInfo);
  }

  @Post("/login")
  @ApiOperation({ summary: "Body에 ID, PW", description: "" })
  @ApiCreatedResponse({ description: "Admin 계정 로그인" })
  loginAdminUser(@Body() adminLoginInput: AdminLoginInput) {
    return this.adminService.loginAdminUser(adminLoginInput);
  }

  @UseGuards(AuthGuard)
  @Put("/me")
  editAdminUser(@Token() token: any, @Body() adminEditInput: AdminEditInput) {
    return this.adminService.editAdminUser(token, adminEditInput);
  }

  @UseGuards(AuthGuard)
  @Get("/me")
  getUserInfo(@Token() token: any) {
    return this.adminService.getUserInfo(token);
  }
}
