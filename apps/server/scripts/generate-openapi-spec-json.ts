import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "../src/app/app.module";
import { NestFactory } from "@nestjs/core";
import path from "path";
import fs from "fs";

export default async function generateOpenAPISchemaJSON() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Pezzo API")
    .setDescription(
      "Specification of the Pezzo REST API, used by various clients."
    )
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const outputPath = path.join(__dirname, "../../../docs/");
  const outputFilePath = path.join(outputPath, "open-api-spec.json");
  fs.writeFileSync(outputFilePath, JSON.stringify(document, null, 2));
  console.log("Generated swagger file");
  process.exit(0);
}

generateOpenAPISchemaJSON();
