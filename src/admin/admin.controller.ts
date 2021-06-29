import { Controller, Post, Body, Put } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminInfoInputDto } from "./dto/admin-info.dto";
import { AdminLoginInput } from "./dto/admin-login.dto";
import { AdminEditInput } from "./dto/admin-edit.dto";
import { AdminAuthUser } from "src/auth/auth-user.decorator";
import { AdminInfoEntity } from "./entities/admin-info.entity";
import { JwtService } from "src/jwt/jwt.service";

@Controller("admin")
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
  loginAdminUser(@Body() adminLoginInput: AdminLoginInput) {
    return this.adminService.loginAdminUser(adminLoginInput);
  }

  @Put("/login")
  editAdminUser(
    @AdminAuthUser() authUser: string,
    @Body() adminEditInput: AdminEditInput,
  ) {
    const decoded = this.jwtService.verify(authUser.toString());

    return this.adminService.editAdminUser(decoded.id, adminEditInput);
  }
}
