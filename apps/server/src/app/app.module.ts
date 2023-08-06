import { join } from "path";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
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
import { MetricsModule } from "./metrics/metrics.module";
import { LoggerModule } from "./logger/logger.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { ReportingModule } from "./reporting/reporting.module";
import { OpenSearchModule } from "./opensearch/opensearch.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { getConfigSchema } from "./config/common-config-schema";
import { PromptTesterModule } from "./prompt-tester/prompt-tester.module";

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
    OpenSearchModule,
    EventEmitterModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: GQL_SCHEMA_PATH,
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: (ctx) => {
        ctx.requestId = ctx.req.headers["x-request-id"] || randomUUID();
        return ctx;
      },
      include: [
        PromptsModule,
        ReportingModule,
        PromptEnvironmentsModule,
        CredentialsModule,
        IdentityModule,
        MetricsModule,
        PromptTesterModule,
      ],
      formatError,
    }),
    AuthModule.forRoot(),
    AnalyticsModule,
    PromptsModule,
    PromptTesterModule,
    PromptEnvironmentsModule,
    CredentialsModule,
    IdentityModule,
    MetricsModule,
    ReportingModule,
    ...(isCloud ? [NotificationsModule] : []),
  ],
  controllers: [HealthController],
})
export class AppModule {}
