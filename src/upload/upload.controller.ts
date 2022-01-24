import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

@Controller("upload")
@ApiTags("Upload")
export class UploadController {
  constructor() {}

  @Post("")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file) {}
}
