import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { ClientInfoDto } from "./dto/client-info.dto";
import { InfoService } from "./info.service";
import { InfoDto } from "src/common/dto/info.dto";
import { HasID } from "src/middlewares/hasid.middleware";
import { Token } from "src/decorator/admin.decorator";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
} from "@nestjs/swagger";
import { ManageMentCategoryEntites } from "src/management/entities/category.entity";

@Controller("info")
@ApiTags("Info")
export class InfoController {
  constructor(private infoService: InfoService) {}

  @Get("/categories")
  @ApiCreatedResponse({
    description: "Sucess",
    type: ManageMentCategoryEntites,
  })
  getCategories() {
    return this.infoService.getCategories();
  }

  @UseGuards(HasID)
  @Get("/data")
  @ApiOperation({ summary: "유저 정보", description: "유저 정보" })
  @ApiBearerAuth()
  getInfo(@Body() @Token() token?: any) {
    if (token) {
      return this.infoService.getUser(token);
    }
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

  // baseInfo = "baseInfo",
  // detailInfo = "detailInfo",
  // fourthStep = "fourthStep",

  // @Post()
  // postSecondInfo() {
  //   console.log("post2");
  // }

  // @Post()
  // postThirdInfo() {
  //   console.log("post3");
  // }
}
