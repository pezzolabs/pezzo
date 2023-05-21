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
import { Prompt as PrismaPrompt } from "@prisma/client";
import { CreatePromptInput } from "./inputs/create-prompt.input";
import { PromptsService } from "./prompts.service";
import { PromptVersion } from "../../@generated/prompt-version/prompt-version.model";
import { CreatePromptVersionInput } from "./inputs/create-prompt-version.input";
import { GetPromptVersionInput } from "./inputs/get-prompt-version.input";
import { GetPromptInput } from "./inputs/get-prompt.input";
import { GetDeployedPromptVersionInput } from "./inputs/get-deployed-prompt-version.input";
import {
  ConflictException,
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

@UseGuards(AuthGuard)
@Resolver(() => Prompt)
export class PromptsResolver {
  constructor(
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private environmentsService: EnvironmentsService
  ) {}

  @Query(() => [Prompt])
  async prompts(
    @Args("data") data: GetProjectPromptsInput,
    @CurrentUser() user: RequestUser
  ) {
    isProjectMemberOrThrow(user, data.projectId);

    const prompts = await this.prisma.prompt.findMany({
      where: {
        projectId: data.projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return prompts;
  }

  @Query(() => Prompt)
  async prompt(
    @Args("data") data: GetPromptInput,
    @CurrentUser() user: RequestUser
  ) {
    const prompt = await this.prisma.prompt.findUnique({
      where: {
        id: data.promptId,
      },
    });

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
    const prompt = await this.promptsService.getPrompt(data.id);

    if (!prompt) {
      throw new NotFoundException();
    }

    isProjectMemberOrThrow(user, prompt.projectId);
    const promptVersions = await this.promptsService.getPromptVersions(data.id);
    return promptVersions;
  }

  @Query(() => Prompt)
  async findPrompt(
    @Args("data") data: FindPromptByNameInput,
    @CurrentUser() user: RequestUser
  ) {
    const prompt = await this.prisma.prompt.findFirst({
      where: {
        name: data.name,
        projectId: {
          in: user.projects.map((p) => p.id),
        },
      },
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt "${data.name}" not found"`);
    }

    isProjectMemberOrThrow(user, prompt.projectId);
    return prompt;
  }

  @Query(() => Prompt)
  async findPromptWithApiKey(
    @Args("data") data: FindPromptByNameInput,
    @ApiKeyProjectId() projectId: string
  ) {
    const prompt = await this.prisma.prompt.findFirst({
      where: {
        name: data.name,
        projectId,
      },
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt "${data.name}" not found"`);
    }

    return prompt;
  }

  @Query(() => PromptVersion)
  async promptVersion(
    @Args("data") data: GetPromptVersionInput,
    @CurrentUser() user: RequestUser
  ) {
    const sha = data.sha;
    let promptVersion: PromptVersion;

    if (sha === "latest") {
      promptVersion = await this.promptsService.getLatestPromptVersion(
        data.sha
      );
    }

    promptVersion = await this.promptsService.getPromptVersion(data.sha);

    if (!promptVersion) {
      throw new NotFoundException();
    }

    isProjectMemberOrThrow(user, promptVersion.prompt.projectId);
    return promptVersion;
  }

  @Query(() => PromptVersion)
  async getLatestPrompt(
    @Args("data") data: PromptWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const prompt = await this.promptsService.getPrompt(data.id);

    if (!prompt) {
      throw new NotFoundException();
    }
    isProjectMemberOrThrow(user, prompt.projectId);

    const promptVersion = await this.promptsService.getLatestPromptVersion(
      data.id
    );
    return promptVersion;
  }

  @Mutation(() => Prompt)
  async createPrompt(
    @Args("data") data: CreatePromptInput,
    @CurrentUser() user: RequestUser
  ) {
    isProjectMemberOrThrow(user, data.projectId);

    const exists = await this.promptsService.getPromptByName(
      data.name,
      data.projectId
    );

    if (exists) {
      throw new ConflictException("Prompt with this name already exists");
    }

    const prompt = await this.promptsService.createPrompt(
      data.name,
      data.integrationId,
      data.projectId
    );
    return prompt;
  }

  @Mutation(() => Prompt)
  async updatePrompt(
    @Args("data") data: PromptUpdateInput,
    @CurrentUser() user: RequestUser
  ) {
    const exists = await this.promptsService.getPrompt(data.id.set);

    if (!exists) {
      throw new NotFoundException();
    }

    isProjectMemberOrThrow(user, exists.projectId);

    const prompt = await this.prisma.prompt.update({
      where: {
        id: data.id.set,
      },
      data: {
        ...data,
      },
    });
    return prompt;
  }

  @Mutation(() => PromptVersion)
  async createPromptVersion(
    @Args("data") data: CreatePromptVersionInput,
    @CurrentUser() user: RequestUser
  ) {
    const prompt = await this.promptsService.getPrompt(data.promptId);

    if (!prompt) {
      throw new NotFoundException();
    }

    isProjectMemberOrThrow(user, prompt.projectId);
    return this.promptsService.createPromptVersion(data);
  }

  @ResolveField(() => [PromptExecution])
  async executions(@Parent() prompt: PrismaPrompt) {
    const executions = await this.prisma.promptExecution.findMany({
      where: {
        promptId: prompt.id,
      },
    });
    return executions;
  }

  @ResolveField(() => PromptVersion)
  async deployedVersion(
    @Parent() prompt: PrismaPrompt,
    @Args("data") data: ResolveDeployedVersionInput
  ) {
    const { projectId } = prompt;
    const { environmentSlug } = data;

    const environment = await this.environmentsService.getBySlug(
      environmentSlug,
      projectId
    );

    if (!environment) {
      throw new NotFoundException(
        `Environment with slug "${environmentSlug}" not found`
      );
    }

    const deployedPrompt = await this.prisma.promptEnvironment.findFirst({
      where: { promptId: prompt.id, environmentId: environment.id },
    });

    if (!deployedPrompt) {
      throw new NotFoundException(
        `Prompt was not deployed to the "${environmentSlug}" environment`
      );
    }

    const promptVersion = await this.promptsService.getPromptVersion(
      deployedPrompt.promptVersionSha
    );

    return promptVersion;
  }

  @ResolveField(() => [PromptVersion])
  async versions(@Parent() prompt: PrismaPrompt) {
    return this.promptsService.getPromptVersions(prompt.id);
  }

  @ResolveField(() => PromptVersion, { nullable: true })
  async version(
    @Parent() prompt: PrismaPrompt,
    @Args("data") data: GetPromptInput
  ) {
    const { version } = data;

    if (version === "latest") {
      return this.promptsService.getLatestPromptVersion(prompt.id);
    }

    return this.promptsService.getPromptVersion(data.version);
  }

  @ResolveField(() => PromptVersion, { nullable: true })
  async latestVersion(@Parent() prompt: PrismaPrompt) {
    return this.promptsService.getLatestPromptVersion(prompt.id);
  }
}
