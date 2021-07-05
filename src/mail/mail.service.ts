import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendToClient() {
    await this.mailerService.sendMail({
      to: "choosey_@naver.com",
      from: '"올리브스톤" <dev@olivestonelab.com>',
      subject: "올리브스톤입니다",
      template: "./mail", // `.hbs` extension is appended automatically
      context: {
        name: "kim",
      },
    });
  }

  async sendToAdminVerfiy() {
    await this.mailerService.sendMail({
      to: "choosey_@naver.com",
      from: '"올리브스톤" <dev@olivestonelab.com>',
      subject: "올리브스톤입니다",
      template: "./mail",
      context: {
        name: "kim",
      },
    });
  }

  async sendToAdminManagertoDownloadFile() {
    await this.mailerService.sendMail({
      to: "choosey_@naver.com",
      from: '"올리브스톤" <dev@olivestonelab.com>',
      subject: "올리브스톤입니다",
      template: "./mail",
      context: {
        name: "kim",
      },
    });
  }
}
