import { Module, Global, DynamicModule } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminInfoEntity } from "src/admin/entities/admin-info.entity";

@Module({ imports: [TypeOrmModule.forFeature([AdminInfoEntity])] })
@Global()
export class AuthMoudle {
  static forRoot(): DynamicModule {
    return {
      module: AuthMoudle,
      exports: [AuthService],
      providers: [AuthService],
    };
  }
}
