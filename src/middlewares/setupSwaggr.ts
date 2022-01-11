import { INestApplication } from "@nestjs/common";
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from "@nestjs/swagger";

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */

const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("I2B")
    .setDescription("I2B Swagger")
    .setVersion("0.0.2")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        name: "JWT",
        in: "header",
      },
      "bearerAuth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document, swaggerCustomOptions);
}
