import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "../src/app/app.module";
import { NestFactory } from "@nestjs/core";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { stderr } from "process";

export default async function generateOpenAPISpecJSON() {
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
  const docsPath = path.join(__dirname, "../../../docs/");
  const outputFilePath = path.join(docsPath, "openapi.json");
  fs.writeFileSync(outputFilePath, JSON.stringify(document));
  console.log("Generated OpenAPI spec");

  let scrapedOutput = "";

  console.log("Scraping the generated OpenAPI JSON");

  scrapedOutput = execSync(
    `cd ${docsPath} && npx --yes @mintlify/scraping@latest openapi-file openapi.json -o api-reference`,
    { encoding: "utf-8" }
  );

  console.log(
    "Scraped the OpenAPI JSON file and generated the MDX files for it"
  );

  const mintJSON = fs.readFileSync(path.join(docsPath, "mint.json"), {
    encoding: "utf-8",
  });

  const mint = JSON.parse(mintJSON);

  mint.navigation = mint.navigation.filter((navigationItem) => {
    const pages: string[] = navigationItem.pages;
    if (pages.length < 1) return true;
    for (let i = 0; i < pages.length; i++) {
      const path = pages[i];
      if (path.startsWith("api-reference/")) return false;
    }
    return true;
  });

  scrapedOutput = scrapedOutput.slice(scrapedOutput.indexOf("["));
  mint.navigation.push(...JSON.parse(scrapedOutput));
  fs.writeFileSync(
    path.join(docsPath, "mint.json"),
    JSON.stringify(mint, null, 2)
  );
  console.log("Updated mint.json file");
  process.exit(0);
}

generateOpenAPISpecJSON();
