import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { PromptEnvironment } from "../../@generated/prompt-environment/prompt-environment.model";
import { PrismaService } from "../prisma.service";
import { PublishPromptInput } from "./inputs/create-prompt-environment.input";
import { ConflictException, NotFoundException, UseGuards } from "@nestjs/common";
import { PromptEnvironmentsService } from "./prompt-environments.service";
import { EnvironmentsService } from "../environments/environments.service";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";

@UseGuards(AuthGuard)
@Resolver()
export class PromptEnvironmentsResolver {
  constructor(
    private promptEnvironmentsService: PromptEnvironmentsService,
    private environmentsService: EnvironmentsService,
    private prisma: PrismaService
  ) {}

  @Mutation(() => PromptEnvironment)
  async publishPrompt(@Args("data") data: PublishPromptInput, @CurrentUser() user: RequestUser) {
    const organizationId = user.orgMemberships[0].organizationId;

    const environment = await this.environmentsService.getBySlug(
      data.environmentSlug,
      organizationId
    );

    if (!environment) {
      throw new NotFoundException(
        `Environment with slug "${data.environmentSlug}" not found`
      );
    }

    const versionAlreadyPublished =
      await this.prisma.promptEnvironment.findFirst({
        where: {
          promptId: data.promptId,
          environmentId: environment.id,
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
        environment.id,
        environment.slug,
        data.promptVersionSha
      );
    return promptEnvironment;
  }
}
