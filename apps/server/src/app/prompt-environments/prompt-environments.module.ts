import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PromptEnvironmentsResolver } from "./prompt-environments.resolver";
import { PromptEnvironmentsService } from "./prompt-environments.service";

@Module({
  providers: [
    PrismaService,
    PromptEnvironmentsResolver,
    PromptEnvironmentsService,
  ]
})
export class PromptEnvironmentsModule {}