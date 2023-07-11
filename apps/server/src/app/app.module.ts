import { join } from "path";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Joi from "joi";
import { randomUUID } from "crypto";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { PromptsModule } from "./prompts/prompts.module";
import { HealthController } from "./health.controller";
import { formatError } from "../lib/gql-format-error";
import { PromptEnvironmentsModule } from "./prompt-environments/prompt-environments.module";
import { CredentialsModule } from "./credentials/credentials.module";
import { AuthModule } from "./auth/auth.module";
import { IdentityModule } from "./identity/identity.module";
import { InfluxDbModule } from "./influxdb/influxdb.module";
import { InfluxModuleOptions } from "./influxdb/types";
import { MetricsModule } from "./metrics/metrics.module";
import { LoggerModule } from "./logger/logger.module";
import { PinoLogger } from "./logger/pino-logger";
import { AnalyticsModule } from "./analytics/analytics.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { getConfigSchema } from "./config/common-config-schema";

const isCloud = process.env.PEZZO_CLOUD === "true";
const GQL_SCHEMA_PATH = join(process.cwd(), "apps/server/src/schema.graphql");

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validationSchema: getConfigSchema(),
      // In CI, we need to skip validation because we don't have a .env file
      // This is consumed by the graphql:schema-generate Nx target
      validate:
        process.env.SKIP_CONFIG_VALIDATION === "true" ? () => ({}) : undefined,
    }),
    EventEmitterModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: GQL_SCHEMA_PATH,
      sortSchema: true,

      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: (ctx) => {
        ctx.requestId = ctx.req.headers["x-request-id"] || randomUUID();
        const logger = new PinoLogger(ctx);
        return ctx;
      },
      include: [
        PromptsModule,
        PromptEnvironmentsModule,
        CredentialsModule,
        IdentityModule,
        MetricsModule,
      ],
      formatError,
    }),
    InfluxDbModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService
      ): Promise<InfluxModuleOptions> => {
        return {
          url: config.get("INFLUXDB_URL"),
          token: config.get("INFLUXDB_TOKEN"),
        };
      },
    }),
    AuthModule.forRoot(),
    AnalyticsModule,
    PromptsModule,
    PromptEnvironmentsModule,
    CredentialsModule,
    IdentityModule,
    MetricsModule,
    ...(isCloud ? [
      NotificationsModule,
    ] : []),
  ],
  controllers: [HealthController],
})
export class AppModule {}
