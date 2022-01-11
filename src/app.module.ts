import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdminModule } from "./admin/admin.module";
import { InfoModule } from "./info/info.module";
import { CommonModule } from "./common/common.module";
import { InfoEntity } from "./common/entities/info.entity";
import { ClientInfoEntity } from "./info/entities/client-info.entity";
import { BaseInfoEntity } from "./info/entities/base-info.entity";
import { DetailInfo } from "./info/entities/detail-info.entity";
import { DueDateEntity } from "./management/entities/dueDate.entity";

import { JwtModule } from "./jwt/jwt.module";
import { MailModule } from "./mail/mail.module";
import { AdminInfoEntity } from "./admin/entities/admin-info.entity";
import { ManageMentModule } from "./management/management.module";
import {
  ManageMentCategoryEntites,
  ManageMentCategoryEntity,
} from "./management/entities/category.entity";
import { AuthMoudle } from "./auth/auth.module";
import { JWTMiddlewares } from "./middlewares/jwt.middlewares";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.production",
      ignoreEnvFile: process.env.NODE_ENV === "production",
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("dev", "production"),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      entities: [
        InfoEntity,
        ClientInfoEntity,
        BaseInfoEntity,
        DetailInfo,
        AdminInfoEntity,
        ManageMentCategoryEntites,
        ManageMentCategoryEntity,
        DueDateEntity,
      ],
      synchronize: true,
      logging: process.env.NODE_ENV !== "production",
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
      host: process.env.MAIL_HOST,
    }),
    AdminModule,
    InfoModule,
    CommonModule,
    ManageMentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddlewares).forRoutes({
      path: "/info",
      method: RequestMethod.POST,
    });
  }
}

// this.adminService.createAdminUser({
//   adminId: "admin",
//   adminPw: "1234",
//   adminEmail: "kxkm02@abc.com",
//   adminName: "client",
// });
