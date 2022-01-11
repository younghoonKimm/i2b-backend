import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { ClientInfoDto } from "./dto/client-info.dto";
import { InfoService } from "./info.service";
import { InfoDto } from "src/common/dto/info.dto";
import { HasID } from "src/middlewares/hasid.middleware";
import { Token } from "src/decorator/admin.decorator";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@Controller("info")
@ApiTags("Info")
export class InfoController {
  constructor(private infoService: InfoService) {}

  @Get()
  @ApiOperation({ summary: "유저 정보", description: "유저 정보" })
  @ApiBearerAuth()
  getInfo(@Body() clientEmail: string) {
    return this.infoService.getUser(clientEmail);
  }

  @UseGuards(HasID)
  @Post("/create")
  @ApiOperation({ summary: "유저 정보 저장", description: "유저 정보 저장" })
  @ApiBearerAuth()
  postFirstInfo(@Body() infoData: InfoDto, @Token() token?: any) {
    if (token) {
      return this.infoService.saveInfo(infoData, token.id);
    }
    return this.infoService.createInfo(infoData);
  }

  // @Post()
  // postSecondInfo() {
  //   console.log("post2");
  // }

  // @Post()
  // postThirdInfo() {
  //   console.log("post3");
  // }
}
