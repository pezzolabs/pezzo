process.env.SKIP_CONFIG_VALIDATION = "true";

import { NestFactory } from "@nestjs/core";
import { PrismaClient } from "@pezzo/prisma-server";
import supertokens from "supertokens-node";
import { AppModule } from "../src/app/app.module";
import { KafkaConsumerService, KafkaProducerService } from "@pezzo/kafka";

// This script only runs in GitHub Actions
if (process.env.GITHUB_ACTIONS !== "true") {
  process.exit(0);
}

export default async function generateGraphQLSchema(): Promise<void> {
  // Override PrismaClient $connect to prevent connections to the database
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  PrismaClient.prototype.$connect = async () => {};

  // Prevent SuperTokens init
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  supertokens.init = async () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  KafkaConsumerService.prototype.connect = async () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  KafkaProducerService.prototype.connect = async () => {};

  // Use the side effect of initializing the nest application for generating
  // the Nest.js schema
  const app = await NestFactory.create(AppModule);
  await app.init();
}

if (require.main === module) {
  generateGraphQLSchema()
    .then(() => {
      console.log("Schema generated");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error.message, error);
      process.exit(1);
    });
}
