import { Module } from "@nestjs/common";
import { PromptsModule } from "../prompts/prompts.module";
import { PromptTesterResolver } from "./prompt-tester.resolver";
import { PromptTesterService } from "./prompt-tester.service";
import { PrismaService } from "../prisma.service";
import { IdentityModule } from "../identity/identity.module";
import { ReportingModule } from "../reporting/reporting.module";

@Module({
  imports: [ReportingModule, PromptsModule, IdentityModule],
  providers: [PrismaService, PromptTesterResolver, PromptTesterService],
})
export class PromptTesterModule {}
