import { Module } from "@nestjs/common";
import { PromptsResolver } from "./prompts.resolver";
import { PrismaService } from "../prisma.service";
import { PromptExecutionsResolver } from "./prompt-executions.resolver";
import { PromptsService } from "./prompts.service";
import { PromptTesterService } from "./prompt-tester.service";

@Module({
  providers: [
    PrismaService,
    PromptsResolver,
    PromptsService,
    PromptTesterService,
    PromptExecutionsResolver,
  ],
})
export class PromptsModule {}
