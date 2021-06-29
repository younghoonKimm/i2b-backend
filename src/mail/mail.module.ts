import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module, Global, DynamicModule } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailModuleOptions } from "./mail.interface";
import { CONFIG_OPTIONS } from "../jwt/jwt.constants";
import { join } from "path";

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      imports: [
        MailerModule.forRoot({
          transport: {
            host: options.host,
            secure: false,
            auth: {
              user: options.user,
              pass: options.pass,
            },
          },
          template: {
            dir: join(__dirname, "templates"),
            adapter: new HandlebarsAdapter(), //Pug나 ejs 사용 가능
            options: {
              strict: true,
            },
          },
        }),
      ],
      module: MailModule,
      exports: [MailService],
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }, MailService],
    };
  }
}
