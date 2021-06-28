import { Controller, Get, Post, Body } from "@nestjs/common";
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
  postFirstInfo(@Body() infoData: InfoDto) {
    return this.infoService.saveInfo(infoData);
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
