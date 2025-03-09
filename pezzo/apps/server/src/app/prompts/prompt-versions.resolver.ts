import {
  Args,
  Query,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { PrismaService } from "../prisma.service";
import { PromptVersion } from "../../@generated/prompt-version/prompt-version.model";
import { CurrentUser } from "../identity/current-user.decorator";
import { CreatePromptVersionInput } from "./inputs/create-prompt-version.input";
import { RequestUser } from "../identity/users.types";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";
import { Prompt } from "../../@generated/prompt/prompt.model";
import {
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { PromptsService } from "./prompts.service";
import { AuthGuard } from "../auth/auth.guard";
import { ExtendedUser } from "../identity/models/extended-user.model";
import { UsersService } from "../identity/users.service";
import { PromptVersionWhereUniqueInput } from "../../@generated/prompt-version/prompt-version-where-unique.input";
import { ProjectsService } from "../identity/projects.service";

@UseGuards(AuthGuard)
@Resolver(() => PromptVersion)
export class PromptVersionsResolver {
  constructor(
    private prismaService: PrismaService,
    private logger: PinoLogger,
    private analytics: AnalyticsService,
    private promptsService: PromptsService,
    private projectsService: ProjectsService,
    private usersService: UsersService
  ) {}

  @Query(() => PromptVersion)
  async promptVersion(
    @Args("data") data: PromptVersionWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({ ...data });
    this.logger.info("Getting prompt version");
    const { sha } = data;

    const promptVersion = await this.promptsService.getPromptVersion(sha);

    if (!promptVersion) {
      throw new NotFoundException(`Prompt version "${sha}" not found`);
    }

    const prompt = await this.promptsService.getPrompt(promptVersion.promptId);
    const project = await this.projectsService.getProjectById(prompt.projectId);

    isOrgMemberOrThrow(user, project.organizationId);

    return promptVersion;
  }

  @Mutation(() => PromptVersion)
  async createPromptVersion(
    @Args("data") data: CreatePromptVersionInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({ ...data }).info("Creating prompt version");
    let prompt: Prompt;

    try {
      prompt = await this.promptsService.getPrompt(data.promptId);
    } catch (error) {
      this.logger.error({ error }, "Error getting existing prompt");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException();
    }

    const project = await this.prismaService.project.findUnique({
      where: {
        id: prompt.projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    try {
      const promptVersion = await this.promptsService.createPromptVersion(
        data,
        user.id
      );
      this.analytics.trackEvent("prompt_version_created", {
        projectId: prompt.projectId,
        promptId: prompt.id,
      });
      return promptVersion;
    } catch (error) {
      this.logger.error({ error }, "Error creating prompt version");
      throw new InternalServerErrorException();
    }
  }

  @ResolveField(() => ExtendedUser)
  async createdBy(@Parent() parent: PromptVersion) {
    const user = await this.usersService.getById(parent.createdById);
    const extendedUser = this.usersService.serializeExtendedUser(user);
    return extendedUser;
  }
}
