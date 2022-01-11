import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminInfoEntity } from "./entities/admin-info.entity";
import {
  AdminCreateInputDto,
  AdminMeOutPutDto,
  AdminCreateOutputDto,
} from "./dto/admin-info.dto";
import { AdminLoginInput, AdminLoginOutput } from "./dto/admin-login.dto";
import { AdminEditInput, AdminEditOutput } from "./dto/admin-edit.dto";
import { JwtService } from "src/jwt/jwt.service";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminInfoEntity)
    private readonly adminInfo: Repository<AdminInfoEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async createAdminUser(
    userData: AdminCreateInputDto,
  ): Promise<AdminCreateOutputDto> {
    const { adminId } = userData;
    try {
      const isAdmin = await this.adminInfo.findOne({ adminId });
      if (isAdmin) {
        return { success: false, error: "계정 중복" };
      } else {
        await this.adminInfo.save(this.adminInfo.create(userData));
        return { success: true };
      }
    } catch (error) {
      console.log(error);
      return { error };
    }
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
        return { token, id: adminUser.adminId };
      }
      return { error: "비밀번호 확인" };
    } catch (error) {
      return { error: "login error" };
    }
  }

  async editAdminUser(
    authUser: string,
    { adminEmail, adminPw }: AdminEditInput,
  ): Promise<AdminEditOutput> {
    try {
      const decoded = this.jwtService.verify(authUser.toString());
      const user = await this.adminInfo.findOne({
        id: decoded.id,
      });

      if (!user) return { success: false, error: "아이디 중복" };

      if (adminEmail) {
        user.adminEmail = adminEmail;
        await this.adminInfo.save(user);
      }
      if (adminPw) {
        user.adminPw = adminPw;
        await this.adminInfo.save(user);
      }
      return { success: true };
    } catch (error) {
      return { error };
    }
  }

  async getUserInfo(token: any): Promise<AdminMeOutPutDto> {
    const user = await this.adminInfo.findOne({
      id: token.id,
    });
    if (user) {
      const { adminId, adminName, adminEmail } = user;
      return { adminId, adminName, adminEmail };
    } else {
      return { error: "notfound" };
    }
  }
}
