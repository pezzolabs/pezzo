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
import { PromptUpdateInput } from "../../@generated/prompt/prompt-update.input";
import { PromptExecution } from "../../@generated/prompt-execution/prompt-execution.model";
import {
  Environment,
  Prompt as PrismaPrompt,
  PromptEnvironment,
} from "@prisma/client";
import { CreatePromptInput } from "./inputs/create-prompt.input";
import { PromptsService } from "./prompts.service";
import { PromptVersion } from "../../@generated/prompt-version/prompt-version.model";
import { CreatePromptVersionInput } from "./inputs/create-prompt-version.input";
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
import { isProjectMemberOrThrow } from "../identity/identity.utils";
import { FindPromptByNameInput } from "./inputs/find-prompt-by-name.input";
import { EnvironmentsService } from "../environments/environments.service";
import { GetProjectPromptsInput } from "./inputs/get-project-prompts.input";
import { ApiKeyProjectId } from "../identity/api-key-project-id.decorator";
import { ResolveDeployedVersionInput } from "./inputs/resolve-deployed-version.input";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";

@UseGuards(AuthGuard)
@Resolver(() => Prompt)
export class PromptsResolver {
  constructor(
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private environmentsService: EnvironmentsService,
    private logger: PinoLogger,
    private analytics: AnalyticsService
  ) {}

  @Query(() => [Prompt])
  async prompts(
    @Args("data") data: GetProjectPromptsInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId } = data;
    isProjectMemberOrThrow(user, data.projectId);
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
    const { promptId, version } = data;
    this.logger.assign({ promptId, version }).info("Getting prompt");

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

    isProjectMemberOrThrow(user, prompt.projectId);
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

    isProjectMemberOrThrow(user, prompt.projectId);

    let promptVersions: PromptVersion[];

    try {
      promptVersions = await this.promptsService.getPromptVersions(data.id);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt versions");
      throw new InternalServerErrorException();
    }

    return promptVersions;
  }

  @Query(() => Prompt)
  async findPromptWithApiKey(
    @Args("data") data: FindPromptByNameInput,
    @ApiKeyProjectId() projectId: string
  ) {
    const { name } = data;
    this.logger.assign({ name, projectId }).info("Finding prompt with API key");
    let prompt: Prompt;

    try {
      prompt = await this.prisma.prompt.findFirst({
        where: {
          name: data.name,
          projectId,
        },
      });
    } catch (error) {
      this.logger.error({ error }, "Error finding prompt with API key");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException(`Prompt "${data.name}" not found"`);
    }

    this.analytics.track("PROMPT:FIND_WITH_API_KEY", "api", {
      projectId,
      promptId: prompt.id,
    });
    return prompt;
  }

  @Query(() => PromptVersion)
  async promptVersion(
    @Args("data") data: GetPromptVersionInput,
    @CurrentUser() user: RequestUser
  ) {
    const { promptId, sha } = data;
    let promptVersion: PromptVersion;

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

    isProjectMemberOrThrow(user, promptVersion.prompt.projectId);
    return promptVersion;
  }

  @Mutation(() => Prompt)
  async createPrompt(
    @Args("data") data: CreatePromptInput,
    @CurrentUser() user: RequestUser
  ) {
    isProjectMemberOrThrow(user, data.projectId);
    const { name, integrationId, projectId } = data;
    this.logger
      .assign({ name, integrationId, projectId })
      .info("Creating prompt");
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
      prompt = await this.promptsService.createPrompt(
        name,
        integrationId,
        projectId
      );
    } catch (error) {
      this.logger.error({ error }, "Error creating prompt");
      throw new InternalServerErrorException();
    }

    this.analytics.track("PROMPT:CREATED", user.id, {
      projectId,
      promptId: prompt.id,
    });

    return prompt;
  }

  @Mutation(() => Prompt)
  async updatePrompt(
    @Args("data") data: PromptUpdateInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({ ...data }).info("Updating prompt");
    let exists: Prompt;

    try {
      exists = await this.promptsService.getPrompt(data.id.set);
    } catch (error) {
      this.logger.error({ error }, "Error getting existing prompt");
      throw new InternalServerErrorException();
    }

    if (!exists) {
      throw new NotFoundException();
    }

    isProjectMemberOrThrow(user, exists.projectId);

    try {
      const prompt = await this.prisma.prompt.update({
        where: {
          id: data.id.set,
        },
        data: {
          ...data,
        },
      });
      return prompt;
    } catch (error) {
      this.logger.error({ error }, "Error updating prompt");
      throw new InternalServerErrorException();
    }
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

    isProjectMemberOrThrow(user, prompt.projectId);

    try {
      const promptVersion = await this.promptsService.createPromptVersion(
        data,
        user.id
      );
      this.analytics.track("PROMPT_VERSION:CREATED", user.id, {
        projectId: prompt.projectId,
        promptId: prompt.id,
      });
      return promptVersion;
    } catch (error) {
      this.logger.error({ error }, "Error creating prompt version");
      throw new InternalServerErrorException();
    }
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

  @ResolveField(() => PromptVersion)
  async deployedVersion(
    @Parent() prompt: PrismaPrompt,
    @Args("data") data: ResolveDeployedVersionInput
  ) {
    this.logger.assign({ ...data }).info("Resolving deployed version");

    const { projectId } = prompt;
    const { environmentSlug } = data;
    let environment: Environment;

    try {
      environment = await this.environmentsService.getBySlug(
        environmentSlug,
        projectId
      );
    } catch (error) {
      this.logger.error({ error }, "Error getting environment");
      throw new InternalServerErrorException();
    }

    if (!environment) {
      throw new NotFoundException(
        `Environment with slug "${environmentSlug}" not found`
      );
    }

    let deployedPrompt: PromptEnvironment;

    try {
      deployedPrompt = await this.prisma.promptEnvironment.findFirst({
        where: { promptId: prompt.id, environmentId: environment.id },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.logger.error({ error }, "Error getting deployed prompt environment");
      throw new InternalServerErrorException();
    }

    if (!deployedPrompt) {
      throw new NotFoundException(
        `Prompt was not deployed to the "${environmentSlug}" environment`
      );
    }

    try {
      const promptVersion = await this.promptsService.getPromptVersion(
        deployedPrompt.promptVersionSha
      );

      return promptVersion;
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt version");
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
  async version(
    @Parent() prompt: PrismaPrompt,
    @Args("data") data: GetPromptInput
  ) {
    this.logger.assign({ ...data }).info("Resolving prompt version");
    const { version } = data;

    try {
      if (version === "latest") {
        return this.promptsService.getLatestPromptVersion(prompt.id);
      }

      return this.promptsService.getPromptVersion(data.version);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt version");
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
