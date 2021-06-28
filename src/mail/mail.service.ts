import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation() {
    await this.mailerService.sendMail({
      to: "kyh0404@olivestonelab.com",
      from: '"올리브스톤" <dev@olivestonelab.com>', // override default from
      subject: "Welcome to Nice App! Confirm your Email",
      template: "./mail", // `.hbs` extension is appended automatically
      context: {
        name: "kim",
      },
    });
  }
}
