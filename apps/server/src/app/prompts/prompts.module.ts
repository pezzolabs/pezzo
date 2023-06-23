import { Module } from "@nestjs/common";
import { PromptsResolver } from "./prompts.resolver";
import { PrismaService } from "../prisma.service";
import { PromptExecutionsResolver } from "./prompt-executions.resolver";
import { PromptsService } from "./prompts.service";
import { PromptTesterService } from "./prompt-tester.service";
import { CredentialsModule } from "../credentials/credentials.module";
import { IdentityModule } from "../identity/identity.module";
import { PromptsV1Controller } from "./prompts-v1.controller";
import { PromptsV2Controller } from "./prompts-v2.controller";
import { PromptVersionsResolver } from "./prompt-versions.resolver";

@Module({
  imports: [CredentialsModule, IdentityModule],
  exports: [PromptsService],
  providers: [
    PrismaService,
    PromptsResolver,
    PromptsService,
    PromptTesterService,
    PromptExecutionsResolver,
    PromptVersionsResolver,
  ],
  controllers: [PromptsV1Controller,PromptsV2Controller],
})
export class PromptsModule {}
