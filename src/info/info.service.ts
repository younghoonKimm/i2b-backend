import { Injectable } from "@nestjs/common";

import { InfoEntity } from "../common/entities/info.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, createConnection } from "typeorm";
import { ClientInfo } from "./entities/client-info.entity";
import { ClientInfoDto, ClientInfoOutput } from "./dto/client-info.dto";
import { InfoDto } from "src/common/dto/info.dto";
import { JwtService } from "src/jwt/jwt.service";
import { BaseInfo } from "./entities/base-info.entity";

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
        // console.log(clientInfo);
        // console.log(
        //   (exists.clientInfo = { ...exists.clientInfo, ...clientInfo }),
        // );

        const infoName = infoNameArray[0];
        // const id = exists[infoName].id;

        // const prevInfo = await this[infoName].findOne({ id });

        // await this[infoName].save({
        //   ...prevInfo,
        //   ...infoData[infoName],
        // });
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
          status: 1,
          clientEmail,
          password,
          clientInfo: crateClientInfo,
        }),
      );

      return { ok: true, token: "dsdsf" };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
