import { Controller, Post, Body, Put, UseGuards, Get } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminInfoInputDto } from "./dto/admin-info.dto";
import { AdminLoginInput, AdminLoginOutput } from "./dto/admin-login.dto";
import { AdminEditInput } from "./dto/admin-edit.dto";
import { AdminAuthUser } from "src/auth/auth-user.decorator";
import { AdminInfoEntity } from "./entities/admin-info.entity";
import { JwtService } from "src/jwt/jwt.service";
import { AuthGuard } from "src/middlewares/auth.middleware";
import { Token } from "src/decorator/admin.decorator";
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiTags,
  ApiBody,
  ApiHeader,
  ApiProperty,
  ApiBearerAuth,
} from "@nestjs/swagger";

@Controller("admin")
@ApiTags("Admin")
export class AdminController {
  constructor(
    private adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("/create")
  @ApiOperation({ summary: "Admin 관리자 생성", description: "" })
  @ApiCreatedResponse({
    description: "Success",
    type: AdminLoginOutput,
  })
  createAdminUser(@Body() adminInfo: AdminInfoInputDto) {
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
  @ApiBearerAuth()
  editAdminUser(@Token() token: any, @Body() adminEditInput: AdminEditInput) {
    return this.adminService.editAdminUser(token, adminEditInput);
  }

  @UseGuards(AuthGuard)
  @Get("/me")
  @ApiBearerAuth()
  @ApiHeader({ name: "Bearer" })
  @ApiOperation({ summary: "Admin 관리자 정보", description: "" })
  getUserInfo(@Token() token: any) {
    return this.adminService.getUserInfo(token);
  }
}
