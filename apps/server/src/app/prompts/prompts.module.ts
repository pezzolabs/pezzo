import { Module } from "@nestjs/common";
import { PromptsResolver } from "./prompts.resolver";
import { PrismaService } from "../prisma.service";
import { PromptExecutionsResolver } from "./prompt-executions.resolver";
import { PromptsService } from "./prompts.service";
import { PezzoClientService } from "../common/pezzo-client.service";

@Module({
  providers: [
    PrismaService,
    PromptsResolver,
    PromptsService,
    PromptExecutionsResolver,
    PezzoClientService
  ]
})
export class PromptsModule {}
