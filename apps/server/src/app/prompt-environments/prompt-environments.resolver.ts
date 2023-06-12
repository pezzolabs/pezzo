import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { PromptEnvironment } from "../../@generated/prompt-environment/prompt-environment.model";
import { PrismaService } from "../prisma.service";
import { PublishPromptInput } from "./inputs/create-prompt-environment.input";
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { PromptEnvironmentsService } from "./prompt-environments.service";
import { EnvironmentsService } from "../identity/environments.service";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import {
  isOrgMemberOrThrow,
  isProjectMemberOrThrow,
} from "../identity/identity.utils";
import { PinoLogger } from "../logger/pino-logger";
import { Environment } from "@prisma/client";
import { AnalyticsService } from "../analytics/analytics.service";

@UseGuards(AuthGuard)
@Resolver()
export class PromptEnvironmentsResolver {
  constructor(
    private promptEnvironmentsService: PromptEnvironmentsService,
    private environmentsService: EnvironmentsService,
    private prisma: PrismaService,
    private logger: PinoLogger,
    private analytics: AnalyticsService
  ) {}

  @Mutation(() => PromptEnvironment)
  async publishPrompt(
    @Args("data") data: PublishPromptInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({ ...data });
    this.logger.info("Publishing prompt to environment");

    let environment: Environment;

    try {
      environment = await this.environmentsService.getById(data.environmentId);
    } catch (error) {
      this.logger.error({ error }, "Error getting environment");
      throw new InternalServerErrorException();
    }

    const project = await this.prisma.project.findUnique({
      where: {
        id: environment.projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    if (!environment) {
      throw new NotFoundException(`Environment not found`);
    }

    let versionAlreadyPublished: PromptEnvironment;

    try {
      versionAlreadyPublished = await this.prisma.promptEnvironment.findFirst({
        where: {
          promptId: data.promptId,
          environmentId: environment.id,
          promptVersionSha: data.promptVersionSha,
        },
      });
    } catch (error) {
      this.logger.error({ error }, "Error checking prompt already published");
      throw new InternalServerErrorException();
    }

    if (versionAlreadyPublished) {
      throw new ConflictException(
        `Prompt version is already published to this environment`
      );
    }

    let promptEnvironment: PromptEnvironment;

    try {
      promptEnvironment =
        await this.promptEnvironmentsService.createPromptEnvironment(
          data.promptId,
          environment.id,
          data.promptVersionSha,
          user.id
        );
      this.logger.info("Prompt published to environment");
    } catch (error) {
      this.logger.error({ error }, "Error creating prompt environment");
      throw new InternalServerErrorException();
    }

    this.analytics.track("PROMPT:PUBLISHED", user.id, {
      projectId: environment.projectId,
      promptId: data.promptId,
      environmentId: environment.id,
    });

    return promptEnvironment;
  }
}
