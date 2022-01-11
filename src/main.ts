import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import "reflect-metadata";

import { AppModule } from "./app.module";
import { setupSwagger } from "./middlewares/setupSwaggr";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  setupSwagger(app);
  await app.listen(process.env.PORT || port);
}
bootstrap();
