import { Module } from "@nestjs/common";
import { PromptsResolver } from "./prompts.resolver";
import { PrismaService } from "../prisma.service";
import { PromptExecutionsResolver } from "./prompt-executions.resolver";
import { PromptsService } from "./prompts.service";
import { IntegrationService } from "../common/integration.service";

@Module({
  providers: [
    PrismaService,
    PromptsResolver,
    PromptsService,
    PromptExecutionsResolver,
    IntegrationService,
  ],
})
export class PromptsModule {}
