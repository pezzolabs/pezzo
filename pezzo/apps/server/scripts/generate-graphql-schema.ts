process.env.SKIP_CONFIG_VALIDATION = "true";

import { NestFactory } from "@nestjs/core";
import { PrismaClient } from "@prisma/client";
import supertokens from "supertokens-node";
import { AppModule } from "../src/app/app.module";
import { KafkaConsumerService, KafkaProducerService } from "pezzo/libs/kafka/src";
import { ClickHouseService } from "../src/app/clickhouse/clickhouse.service";
import { RedisService } from "../src/app/redis/redis.service";

// This script only runs in GitHub Actions
if (process.env.GITHUB_ACTIONS !== "true") {
  process.exit(0);
}

/**
 * When generating the GraphQL schema in offline mode (CI), we don't want to connect to all
 * external services, and we also don't want to serve the server. Therefore, we need to generate
 * a static `schenma.gql` file to be used by `graphql-codegen`. To achieve this, we need to mock
 * all external-facing services to prevent them from trying to establish connections.
 */
export default async function generateGraphQLSchema(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  PrismaClient.prototype.$connect = async () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  supertokens.init = async () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  KafkaConsumerService.prototype.connect = async () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  KafkaProducerService.prototype.connect = async () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ClickHouseService.prototype.onModuleInit = async () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  RedisService.prototype.onModuleInit = async () => {};

  // Use the side effect of initializing the nest application for generating
  // the Nest.js schema
  const app = await NestFactory.create(AppModule);
  await app.init();
}

if (require.main === module) {
  generateGraphQLSchema()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error.message, error);
      process.exit(1);
    });
}
