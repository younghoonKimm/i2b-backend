import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";
import { AdminInfoEntity, AdminRole } from "./entities/admin-info.entity";
import {
  AdminCreateInputDto,
  AdminMeOutPutDto,
  AdminCreateOutputDto,
} from "./dto/admin-info.dto";
import { AdminLoginInput, AdminLoginOutput } from "./dto/admin-login.dto";
import { AdminEditInput, AdminEditOutput } from "./dto/admin-edit.dto";
import { JwtService } from "src/jwt/jwt.service";
import { AdminAllUserOutput } from "./dto/admin-all-user.dto";

@Injectable()
export class AdminService {
  constructor(
    private connection: Connection,
    @InjectRepository(AdminInfoEntity)
    private readonly adminInfo: Repository<AdminInfoEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async checkUser(adminId: string) {
    console.log(adminId);
    const user = await this.adminInfo.findOne({
      adminId: adminId,
    });

    if (user) {
      return true;
    } else {
      return false;
    }
  }
  async createAdminUser(
    token: any,
    data: AdminCreateInputDto,
  ): Promise<AdminCreateOutputDto> {
    const { adminId } = data;

    try {
      const user = await this.adminInfo.findOne({ id: token.id });

      if (user.role === AdminRole.System) {
        const isAdmin = await this.adminInfo.findOne({ adminId });
        if (isAdmin) {
          return { success: false, error: "계정 중복" };
        } else {
          await this.adminInfo.save(
            this.adminInfo.create({
              ...data,
            }),
          );

          // await this.adminInfo.save(this.adminInfo.create(data));
        }

        return { success: true };
      } else {
        return { error: "권한 없음" };
      }
    } catch (error) {
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
    token: any,
    adminEditInput: AdminEditInput,
  ): Promise<AdminEditOutput> {
    const { adminEmail, adminPw, adminChnagePw } = adminEditInput;
    try {
      const user = await this.adminInfo.findOne({
        id: token.id,
      });

      if (!user) return { success: false, error: "아이디 중복" };

      // const decoded = this.jwtService.verify(user.adminPw.toString());

      // console.log("a");
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

  async getAllAdminUSer(token: any): Promise<AdminAllUserOutput> {
    try {
      const users = await this.adminInfo
        .createQueryBuilder("admin_info_entity")
        .where(
          "admin_info_entity.id != :id AND admin_info_entity.role = :role",
          { id: token.id, role: AdminRole.Watch },
        )
        .select([
          "admin_info_entity.id",
          "admin_info_entity.adminEmail",
          "admin_info_entity.adminName",
          "admin_info_entity.role",
          "admin_info_entity.updateAt",
          "admin_info_entity.adminId",
        ])
        .getMany();
      if (users) {
        return { users };
      } else {
        return { error: "사용자가 없습니다." };
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getUserInfo(token: any): Promise<AdminMeOutPutDto> {
    const user = await this.adminInfo.findOne({
      id: token.id,
    });

    if (user) {
      const { adminId, adminName, adminEmail, role, createdAt } = user;
      return { adminId, adminName, adminEmail, role, createdAt };
    } else {
      return { error: "notfound" };
    }
  }

  async deleteAdminUser(token: any, { id }: any) {
    const user = await this.adminInfo.findOne({
      id: token.id,
    });

    try {
      if (user) {
        if (user.role === AdminRole.System) {
          return await this.adminInfo.delete({ id });
        } else {
          return {
            error: "권한이 없습니다",
          };
        }
      }
    } catch (error) {
      return { error };
    }
  }
}
