import { Module } from "@nestjs/common";
import { PromptsResolver } from "./prompts.resolver";
import { PrismaService } from "../prisma.service";
import { PromptsService } from "./prompts.service";
import { CredentialsModule } from "../credentials/credentials.module";
import { IdentityModule } from "../identity/identity.module";
import { PromptsController } from "./prompts.controller";
import { PromptVersionsResolver } from "./prompt-versions.resolver";

@Module({
  imports: [CredentialsModule, IdentityModule],
  exports: [PromptsService],
  providers: [
    PrismaService,
    PromptsResolver,
    PromptsService,
    PromptVersionsResolver,
  ],
  controllers: [PromptsController],
})
export class PromptsModule {}
