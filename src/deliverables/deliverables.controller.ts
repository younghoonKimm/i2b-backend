import { Controller, UseGuards, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeliverablesService } from "./deliverables.service";
import { AuthGuard } from "src/middlewares/auth.middleware";

@Controller("deliverables")
@ApiTags("deliverables")
export class DeliverableController {
  constructor(private deliverablesService: DeliverablesService) {}

  @UseGuards(AuthGuard)
  @Get("")
  getDeliveralbeData() {
    return this.deliverablesService.getDeliverables();
  }

  @UseGuards(AuthGuard)
  @Post("")
  saveDeliveralbeData() {
    return this.deliverablesService.postDeliverables();
  }

  @UseGuards(AuthGuard)
  @Post("/set")
  setDeliveralbeData() {
    return this.deliverablesService.setDeliverableLists();
  }
}
