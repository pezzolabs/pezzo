import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { PromptEnvironment } from "../../@generated/prompt-environment/prompt-environment.model";
import { PrismaService } from "../prisma.service";
import { PublishPromptInput } from "./inputs/create-prompt-environment.input";
import { ConflictException } from "@nestjs/common";
import { PromptEnvironmentsService } from "./prompt-environments.service";

@Resolver()
export class PromptEnvironmentsResolver {
  constructor(
    private promptEnvironmentsService: PromptEnvironmentsService,
    private prisma: PrismaService
  ) {}

  @Mutation(() => PromptEnvironment)
  async publishPrompt(@Args("data") data: PublishPromptInput) {
    const versionAlreadyPublished =
      await this.prisma.promptEnvironment.findFirst({
        where: {
          promptId: data.promptId,
          environmentSlug: data.environmentSlug,
          promptVersionSha: data.promptVersionSha,
        },
      });

    if (versionAlreadyPublished) {
      throw new ConflictException(
        `Prompt version already published to environment "${data.environmentSlug}"`
      );
    }

    const promptEnvironment =
      await this.promptEnvironmentsService.createPromptEnvironment(
        data.promptId,
        data.environmentSlug,
        data.promptVersionSha
      );
    return promptEnvironment;
  }
}
