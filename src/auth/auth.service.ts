import { Injectable } from "@nestjs/common";
import { AdminInfoEntity } from "src/admin/entities/admin-info.entity";
import { Repository } from "typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminInfoEntity)
    private readonly adminInfo: Repository<AdminInfoEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async adminTokenValidate(authUser: string): Promise<any> {
    const decoded = this.jwtService.verify(authUser.toString());

    const user = await this.adminInfo.findOne({
      id: decoded.id,
    });
    try {
      if (user) return user;
    } catch (error) {
      return false;
    }
  }
}
