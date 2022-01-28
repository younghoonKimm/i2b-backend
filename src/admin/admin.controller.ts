import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
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
import { AdminAllUserOutput } from "./dto/admin-all-user.dto";

@Controller("admin")
@ApiTags("Admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

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
    console.log(adminEditInput);
    return this.adminService.editAdminUser(token, adminEditInput);
  }

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

  @UseGuards(AuthGuard)
  @Get("/users")
  @ApiBearerAuth("bearerAuth")
  // @ApiOperation()
  // @ApiCreatedResponse()
  getAllUserInfo(@Token() token: any): Promise<AdminAllUserOutput> {
    return this.adminService.getAllAdminUSer(token);
  }

  @UseGuards(AuthGuard)
  @Post("/user/create")
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "Admin 관리자 생성", description: "" })
  @ApiCreatedResponse({
    description: "Success",
    type: AdminCreateOutputDto,
  })
  createAdminUser(
    @Token() token: any,
    @Body() data: AdminCreateInputDto,
  ): Promise<AdminCreateOutputDto> {
    return this.adminService.createAdminUser(token, data);
  }

  @UseGuards(AuthGuard)
  @Post("/user/delete")
  @ApiBearerAuth("bearerAuth")
  deleteUser(@Token() token: any, @Body() id: any) {
    return this.adminService.deleteAdminUser(token, id);
  }

  @UseGuards(AuthGuard)
  @Get("/user/check")
  @ApiBearerAuth("bearerAuth")
  getUserCheck(@Body() adminId: string) {
    return this.adminService.checkUser(adminId);
  }
}
