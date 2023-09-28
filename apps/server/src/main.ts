import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import supertokens from "supertokens-node";
import { AppModule } from "./app/app.module";
import { SupertokensExceptionFilter } from "./app/auth/auth.filter";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const globalPrefix = "api";
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  });

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new SupertokensExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Pezzo API")
    .setDescription("The Pezzo API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
