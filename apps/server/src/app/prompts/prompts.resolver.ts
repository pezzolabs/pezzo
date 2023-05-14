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
import { Prompt as PrismaPrompt, User } from "@prisma/client";
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
import { AuthGuard, AuthMethod } from "../auth/auth.guard";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { ApiKeyOrgId } from "../identity/api-key-org-id";
import { FindPromptByNameInput } from "./inputs/find-prompt-by-name.input";
import { EnvironmentsService } from "../environments/environments.service";

@UseGuards(AuthGuard)
@Resolver(() => Prompt)
export class PromptsResolver {
  constructor(
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private environmentsService: EnvironmentsService
  ) {}

  @Query(() => [Prompt])
  async prompts(@CurrentUser() user: RequestUser) {
    const prompts = await this.prisma.prompt.findMany({
      where: {
        organizationId: {
          in: user.orgMemberships.map((m) => m.organizationId),
        },
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

    isOrgMemberOrThrow(user, prompt.organizationId);
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

    isOrgMemberOrThrow(user, prompt.organizationId);

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
        organizationId: user.orgMemberships[0].organizationId,
      },
    });

    if (!prompt) {
      throw new NotFoundException();
    }

    isOrgMemberOrThrow(user, prompt.organizationId);
    return prompt;
  }

  @Query(() => Prompt)
  async findPromptWithApiKey(
    @Args("data") data: FindPromptByNameInput,
    @ApiKeyOrgId() organizationId: string
  ) {
    const prompt = await this.prisma.prompt.findFirst({
      where: {
        name: data.name,
        organizationId,
      },
    });

    if (!prompt) {
      throw new NotFoundException();
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

    isOrgMemberOrThrow(user, promptVersion.prompt.organizationId);
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
    isOrgMemberOrThrow(user, prompt.organizationId);

    const promptVersion = await this.promptsService.getLatestPromptVersion(
      data.id
    );
    return promptVersion;
  }

  @Query(() => PromptVersion)
  async deployedPromptVersionWithApiKey(
    @Args("data") data: GetDeployedPromptVersionInput,
    @ApiKeyOrgId() organizationId: string
  ) {
    const { environmentSlug, promptId } = data;
    const prompt = await this.promptsService.getPrompt(promptId);

    if (!prompt) {
      throw new NotFoundException(`Prompt with id "${promptId}" not found`);
    }

    const environment = await this.environmentsService.getBySlug(
      environmentSlug,
      organizationId
    );

    if (!environment) {
      throw new NotFoundException(
        `Environment with slug "${environmentSlug}" not found`
      );
    }

    const deployedPrompt = await this.prisma.promptEnvironment.findFirst({
      where: { promptId, environmentId: environment.id },
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

  @Query(() => PromptVersion)
  async deployedPromptVersion(
    @Args("data") data: GetDeployedPromptVersionInput,
    @CurrentUser() user: RequestUser
  ) {
    const { environmentSlug, promptId } = data;
    const organizationId = user.orgMemberships[0].organizationId;

    const prompt = await this.promptsService.getPrompt(promptId);

    if (!prompt) {
      throw new NotFoundException(`Prompt with id "${promptId}" not found`);
    }

    isOrgMemberOrThrow(user, prompt.organizationId);

    const environment = await this.environmentsService.getBySlug(
      environmentSlug,
      organizationId
    );

    if (!environment) {
      throw new NotFoundException(
        `Environment with slug "${environmentSlug}" not found`
      );
    }

    const deployedPrompt = await this.prisma.promptEnvironment.findFirst({
      where: { promptId, environmentId: environment.id },
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

  @Mutation(() => Prompt)
  async createPrompt(
    @Args("data") data: CreatePromptInput,
    @CurrentUser() user: RequestUser
  ) {
    const exists = await this.promptsService.getPromptByName(
      data.name,
      user.orgMemberships[0].organizationId
    );

    if (exists) {
      throw new ConflictException("Prompt with this name already exists");
    }

    const prompt = await this.promptsService.createPrompt(
      data.name,
      data.integrationId,
      user.orgMemberships[0].organizationId
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

    isOrgMemberOrThrow(user, exists.organizationId);

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

    isOrgMemberOrThrow(user, prompt.organizationId);
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
