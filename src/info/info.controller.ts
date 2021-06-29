import { Controller, Get, Post, Body, Req } from "@nestjs/common";
import { ClientInfoDto } from "./dto/client-info.dto";

import { InfoService } from "./info.service";
import { InfoDto } from "src/common/dto/info.dto";

@Controller("info")
export class InfoController {
  constructor(private infoService: InfoService) {}
  @Get()
  getInfo(@Body() clientEmail: string) {
    return this.infoService.findUser(clientEmail);
  }

  @Post()
  postFirstInfo(@Body() infoData: InfoDto, @Req() req: any) {
    console.log(infoData);
    const hasId = req.infoId;
    if (hasId) {
      return this.infoService.saveInfo(infoData, hasId);
    }
    return this.infoService.createInfo(infoData);
  }

  @Post()
  postSecondInfo() {
    console.log("post2");
  }

  @Post()
  postThirdInfo() {
    console.log("post3");
  }
}
