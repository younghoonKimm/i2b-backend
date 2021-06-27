import { Injectable } from "@nestjs/common";

import { InfoEntity } from "../common/entities/info.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, createConnection } from "typeorm";
import { ClientInfo } from "./entities/client-info.entity";
import { ClientInfoDto } from "./dto/post-first-info.dto";
import { InfoDto } from "src/common/dto/info.dto";
import { JwtService } from "src/jwt/jwt.service";
import { BaseInfo } from "./entities/base-info.entity";

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

  async saveInfo(infoData: InfoDto): Promise<{ a: boolean }> {
    try {
      const { clientEmail, password, clientInfo } = infoData;
      const exists = await this.info.findOne({ clientEmail });

      if (exists) {
        exists.clientInfo = clientInfo;
        await this.clientInfo.save(exists);
        return { a: false };
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

      return { a: true };
    } catch (e) {
      console.log(e);
      return { a: false };
    }
  }
}
