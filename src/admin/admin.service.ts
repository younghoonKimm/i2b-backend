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

  async checkUser(adminId) {
    const user = await this.adminInfo.findOne({
      adminId,
    });

    if (user) {
      return true;
    } else {
      return false;
    }
  }
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
      const { adminId, adminName, adminEmail, role } = user;
      return { adminId, adminName, adminEmail, role };
    } else {
      return { error: "notfound" };
    }
  }

  async deleteAdminUser(token: any, id: any) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await queryRunner.manager.findOne(AdminInfoEntity, {
      id: token.id,
    });
    try {
      if (user) {
        if (user.role === AdminRole.System) {
          await queryRunner.manager.delete(AdminInfoEntity, { id });
          // await this.adminInfo
          //   .createQueryBuilder("admin_info_entity")
          //   .delete()
          //   .where("id = :id", { id });
          // await this.adminInfo.delete({
          //   id: body.id,
          // });
        } else {
          return {
            error: "권한이 없습니다",
          };
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { error };
    } finally {
      queryRunner.release();
    }
  }
}
