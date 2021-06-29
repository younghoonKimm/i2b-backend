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

  async findById(id: string): Promise<InfoDto> {
    return await this.info.findOne({ id });
  }

  async saveInfo(infoData: InfoDto, id: string): Promise<ClientInfoOutput> {
    try {
      const { clientInfo } = infoData;

      const exists = await this.info.findOne(
        { id },
        { relations: [...infoNameArray] },
      );

      if (exists) {
        const infoName = infoNameArray[0]; //0 will be status

        await this[infoName].save({
          ...exists.clientInfo,
          ...clientInfo,
        });

        await this.info.save(exists);

        const token = this.jwtService.sign({ id: exists.id });
        return { ok: true, token };
      } else {
        return { ok: false, error: "오류" };
      }

      // const crateClientInfo = await this.clientInfo.save(
      //   this.clientInfo.create(clientInfo),
      // );

      // const newInfoData = await this.info.save(
      //   this.info.create({
      //     status: 1, //will be just status.
      //     password,
      //     clientInfo: crateClientInfo,
      //   }),
      // );
      // const token = this.jwtService.sign({ id: newInfoData.id });
      // console.log(token);
      // await this.mailService.sendToClient();
      // return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async createInfo(infoData: InfoDto): Promise<ClientInfoOutput> {
    try {
      const { clientInfo, baseInfo, detailInfo, password } = infoData;

      const crateClientInfo = await this.clientInfo.save(
        this.clientInfo.create(clientInfo),
      );

      const crateBaseInfo =
        baseInfo && (await this.baseInfo.save(this.baseInfo.create(baseInfo)));

      const newInfoData = await this.info.save(
        this.info.create({
          status: 1, //will be just status.
          password,
          clientInfo: crateClientInfo,
          baseInfo: crateBaseInfo,
        }),
      );
      const token = this.jwtService.sign({ id: newInfoData.id });

      await this.mailService.sendToClient();

      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async uploadFile() {}

  async saveInfoInDetailPage() {
    await console.log(32223);
  }
}
