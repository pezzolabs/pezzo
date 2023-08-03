import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Prompt } from "../../@generated/prompt/prompt.model";
import { PrismaService } from "../prisma.service";
import { PromptWhereUniqueInput } from "../../@generated/prompt/prompt-where-unique.input";
import { PromptExecution } from "../../@generated/prompt-execution/prompt-execution.model";
import { Prompt as PrismaPrompt } from "@prisma/client";
import { CreatePromptInput } from "./inputs/create-prompt.input";
import { PromptsService } from "./prompts.service";
import { GetPromptVersionInput } from "./inputs/get-prompt-version.input";
import { GetPromptInput } from "./inputs/get-prompt.input";
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { GetProjectPromptsInput } from "./inputs/get-project-prompts.input";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";
import { PromptVersion } from "../../@generated/prompt-version/prompt-version.model";
import { OrganizationsService } from "../identity/organizations.service";

@UseGuards(AuthGuard)
@Resolver(() => Prompt)
export class PromptsResolver {
  constructor(
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private organizationsService: OrganizationsService,
    private logger: PinoLogger,
    private analytics: AnalyticsService
  ) {}

  @Query(() => [Prompt])
  async prompts(
    @Args("data") data: GetProjectPromptsInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId } = data;

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    this.logger.assign({ projectId }).info("Getting prompts");

    try {
      const prompts = await this.prisma.prompt.findMany({
        where: {
          projectId: data.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return prompts;
    } catch (error) {
      this.logger.error({ error }, "Error getting prompts");
      throw new InternalServerErrorException();
    }
  }

  @Query(() => Prompt)
  async prompt(
    @Args("data") data: GetPromptInput,
    @CurrentUser() user: RequestUser
  ) {
    const { promptId } = data;
    this.logger.assign({ promptId }).info("Getting prompt");

    let prompt: Prompt;

    try {
      prompt = await this.prisma.prompt.findUnique({
        where: {
          id: promptId,
        },
      });
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException();
    }

    const project = await this.prisma.project.findUnique({
      where: {
        id: prompt.projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);
    return prompt;
  }

  @Query(() => [PromptVersion])
  async promptVersions(
    @Args("data") data: PromptWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const { id: promptId } = data;
    this.logger.assign({ promptId }).info("Getting prompt versions");

    let prompt: Prompt;

    try {
      prompt = await this.promptsService.getPrompt(data.id);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException();
    }

    const project = await this.prisma.project.findUnique({
      where: {
        id: prompt.projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    let promptVersions;

    try {
      promptVersions = await this.promptsService.getPromptVersions(data.id);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt versions");
      throw new InternalServerErrorException();
    }

    return promptVersions;
  }

  @Query(() => PromptVersion)
  async promptVersion(
    @Args("data") data: GetPromptVersionInput,
    @CurrentUser() user: RequestUser
  ) {
    const { promptId, sha } = data;
    let promptVersion;

    try {
      if (sha === "latest") {
        promptVersion = await this.promptsService.getLatestPromptVersion(
          promptId
        );
      }

      promptVersion = await this.promptsService.getPromptVersion(sha);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt version");
      throw new InternalServerErrorException();
    }

    if (!promptVersion) {
      throw new NotFoundException();
    }

    const project = await this.prisma.project.findUnique({
      where: {
        id: promptVersion.prompt.projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);
    return promptVersion;
  }

  @Mutation(() => Prompt)
  async createPrompt(
    @Args("data") data: CreatePromptInput,
    @CurrentUser() user: RequestUser
  ) {
    const { name, projectId } = data;
    this.logger.assign({ name, projectId }).info("Creating prompt");

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    let exists: Prompt;

    try {
      exists = await this.promptsService.getPromptByName(
        data.name,
        data.projectId
      );
    } catch (error) {
      this.logger.error({ error }, "Error getting existing prompt by name");
      throw new InternalServerErrorException();
    }

    if (exists) {
      throw new ConflictException("Prompt with this name already exists");
    }

    let prompt: Prompt;

    try {
      prompt = await this.promptsService.createPrompt(data);
    } catch (error) {
      this.logger.error({ error }, "Error creating prompt");
      throw new InternalServerErrorException();
    }

    this.analytics.trackEvent("prompt_created", {
      promptId: prompt.id,
      projectId,
    });

    return prompt;
  }

  @Mutation(() => Prompt)
  async deletePrompt(
    @Args("data") data: PromptWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const { id } = data;
    this.logger.assign({ id }).info("Deleting prompt");

    let prompt = await this.promptsService.deletePrompt(id);
    const org = await this.organizationsService.getOrgByProjectId(
      prompt.projectId
    );

    isOrgMemberOrThrow(user, org.id);

    try {
      prompt = await this.promptsService.deletePrompt(id);
    } catch (error) {
      this.logger.error({ error }, "Error deleting prompt");
      throw new InternalServerErrorException();
    }

    this.analytics.track("PROMPT:DELETED", user.id, {
      promptId: id,
      projectId: prompt.projectId,
      organizationId: org.id,
    });

    return prompt;
  }

  @ResolveField(() => [PromptExecution])
  async executions(@Parent() prompt: PrismaPrompt) {
    this.logger
      .assign({ promptId: prompt.id })
      .info("Resolving prompt executions");

    try {
      const executions = await this.prisma.promptExecution.findMany({
        where: {
          promptId: prompt.id,
        },
      });
      return executions;
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt executions");
      throw new InternalServerErrorException();
    }
  }

  @ResolveField(() => [PromptVersion])
  async versions(@Parent() prompt: PrismaPrompt) {
    this.logger.info("Resolving prompt versions");

    try {
      return this.promptsService.getPromptVersions(prompt.id);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt versions");
      throw new InternalServerErrorException();
    }
  }

  @ResolveField(() => PromptVersion, { nullable: true })
  async latestVersion(@Parent() prompt: PrismaPrompt) {
    this.logger.info("Resolving prompt latest version");

    try {
      return this.promptsService.getLatestPromptVersion(prompt.id);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt latest version");
      throw new InternalServerErrorException();
    }
  }
}
