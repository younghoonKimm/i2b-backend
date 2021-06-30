import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminInfoEntity } from "./entities/admin-info.entity";
import { AdminInfoInputDto } from "./dto/admin-info.dto";
import { AdminLoginInput, AdminLoginOutput } from "./dto/admin-login.dto";
import { AdminEditInput } from "./dto/admin-edit.dto";
import { JwtService } from "src/jwt/jwt.service";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminInfoEntity)
    private readonly adminInfo: Repository<AdminInfoEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async createAdminUser(
    userData: AdminInfoInputDto,
  ): Promise<{ status: boolean }> {
    await this.adminInfo.save(this.adminInfo.create(userData));
    return { status: true };
  }

  async loginAdminUser({
    adminId,
    adminPw,
  }: AdminLoginInput): Promise<AdminLoginOutput> {
    try {
      const adminUser = await this.adminInfo.findOne(
        { adminId },
        { select: ["id", "adminPw", "adminId"] },
      );
      const passwordCorrect = await adminUser.checkPassword(adminPw);
      if (passwordCorrect) {
        const token = this.jwtService.sign({ id: adminUser.id });
        return { ok: true, token, id: adminUser.adminId };
      }
      return { ok: false, error: "비밀번호 확인" };
    } catch (error) {
      return { ok: false, error: "login error" };
    }
  }

  async editAdminUser(
    authUser: string,
    { adminEmail, adminPw }: AdminEditInput,
  ) {
    const decoded = this.jwtService.verify(authUser.toString());
    const user = await this.adminInfo.findOne({
      id: decoded.id,
    });

    if (!user) return { ok: false };

    if (adminEmail) {
      user.adminEmail = adminEmail;
      await this.adminInfo.save(user);
    }
    if (adminPw) {
      user.adminPw = adminPw;
      await this.adminInfo.save(user);
    }
    return { ok: true };
  }
}
