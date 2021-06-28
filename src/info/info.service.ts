import { Injectable } from "@nestjs/common";

import { InfoEntity } from "../common/entities/info.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, createConnection } from "typeorm";
import { ClientInfo } from "./entities/client-info.entity";
import { ClientInfoDto, ClientInfoOutput } from "./dto/client-info.dto";
import { InfoDto } from "src/common/dto/info.dto";
import { JwtService } from "src/jwt/jwt.service";
import { BaseInfo } from "./entities/base-info.entity";
import { MailService } from "src/mail/mail.service";

const infoNameArray = ["clientInfo", "baseInfo"];

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(InfoEntity) private readonly info: Repository<InfoEntity>,
    @InjectRepository(ClientInfo)
    private readonly clientInfo: Repository<ClientInfo>,
    @InjectRepository(BaseInfo)
    private readonly baseInfo: Repository<BaseInfo>,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async findUser(clientEmail: string) {
    const user = await this.info.findOne(clientEmail, {
      relations: ["clientInfo", "baseInfo"],
    });

    return user;
  }

  async findById(id: number): Promise<InfoDto> {
    return this.info.findOne({ id });
  }

  async saveInfo(infoData: InfoDto): Promise<ClientInfoOutput> {
    try {
      const { clientEmail, password, clientInfo } = infoData;

      const exists = await this.info.findOne(
        { clientEmail },
        { relations: [...infoNameArray] },
      );

      if (exists) {
        const infoName = infoNameArray[0]; //0 will be status

        await this[infoName].save({
          ...exists.clientInfo,
          ...clientInfo,
        });

        return { ok: true, token: "ischanged" };
      }

      const crateClientInfo = await this.clientInfo.save(
        this.clientInfo.create(clientInfo),
      );

      const newInfoData = await this.info.save(
        this.info.create({
          status: 1, //will be just status.
          clientEmail,
          password,
          clientInfo: crateClientInfo,
        }),
      );
      await this.mailService.sendUserConfirmation();
      return { ok: true, token: "dsdsf" };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async uploadFile() {}

  async saveInfoInDetailPage() {
    await console.log(32223);
  }
}
