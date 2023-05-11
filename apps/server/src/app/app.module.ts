import { join } from "path";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import Joi from "joi";

import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { PromptsModule } from "./prompts/prompts.module";
import { HealthController } from "./health.controller";
import { EnvironmentsModule } from "./environments/environments.module";
import { formatError } from "../lib/gql-format-error";
import { PromptEnvironmentsModule } from "./prompt-environments/prompt-environments.module";

const GQL_SCHEMA_PATH = join(process.cwd(), "apps/server/src/schema.graphql");

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
        OPENAI_API_KEY: Joi.string().required(),
      }),
      // In CI, we need to skip validation because we don't have a .env file
      // This is consumed by the graphql:schema-generate Nx target
      validate:
        process.env.SKIP_CONFIG_VALIDATION === "true" ? () => ({}) : undefined,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: GQL_SCHEMA_PATH,
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      include: [PromptsModule, EnvironmentsModule, PromptEnvironmentsModule],
      formatError,
    }),
    PromptsModule,
    EnvironmentsModule,
    PromptEnvironmentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
