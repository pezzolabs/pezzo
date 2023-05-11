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
import { PromptWhereInput } from "../../@generated/prompt/prompt-where.input";
import { PromptExecution } from "../../@generated/prompt-execution/prompt-execution.model";
import { Prompt as PrismaPrompt } from "@prisma/client";
import { CreatePromptInput } from "./inputs/create-prompt.input";
import { PromptsService } from "./prompts.service";
import { PromptVersion } from "../../@generated/prompt-version/prompt-version.model";
import { CreatePromptVersionInput } from "./inputs/create-prompt-version.input";
import { GetPromptVersionInput } from "./inputs/get-prompt-version.input";
import { GetPromptInput } from "./inputs/get-prompt.input";
import { GetDeployedPromptVersionInput } from "./inputs/get-deployed-prompt-version.input";
import { NotFoundException } from "@nestjs/common";

@Resolver(() => Prompt)
export class PromptsResolver {
  constructor(
    private prisma: PrismaService,
    private promptsService: PromptsService
  ) {}

  @Query(() => [Prompt])
  async prompts() {
    const prompts = await this.prisma.prompt.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return prompts;
  }

  @Query(() => Prompt)
  async prompt(@Args("data") data: GetPromptInput) {
    const prompt = await this.prisma.prompt.findUnique({
      where: {
        id: data.promptId,
      },
    });
    return prompt;
  }

  @Query(() => [PromptVersion])
  async promptVersions(@Args("data") data: PromptWhereUniqueInput) {
    const promptVersions = await this.promptsService.getPromptVersions(data.id);
    return promptVersions;
  }

  @Query(() => Prompt)
  async findPrompt(@Args("data") data: PromptWhereInput) {
    console.log("data", data);
    const prompt = await this.prisma.prompt.findFirst({
      where: data,
    });
    return prompt;
  }

  @Query(() => PromptVersion)
  async promptVersion(@Args("data") data: GetPromptVersionInput) {
    const sha = data.sha;

    if (sha === "latest") {
      return this.promptsService.getLatestPromptVersion(data.sha);
    }

    return this.promptsService.getPromptVersion(data.sha);
  }

  @Query(() => PromptVersion)
  async getLatestPrompt(@Args("data") data: PromptWhereUniqueInput) {
    const prompt = await this.promptsService.getLatestPromptVersion(data.id);
    return prompt;
  }

  @Query(() => PromptVersion)
  async deployedPromptVersion(
    @Args("data") data: GetDeployedPromptVersionInput
  ) {
    const { environmentSlug, promptId } = data;
    const id = `${environmentSlug}_${promptId}`;
    const deployed = await this.prisma.promptEnvironment.findUnique({
      where: { id },
    });

    if (!deployed) {
      throw new NotFoundException(
        `Prompt was not deployed to the "${environmentSlug}" environment`
      );
    }

    const promptVersion = await this.promptsService.getPromptVersion(
      deployed.promptVersionSha
    );
    return promptVersion;
  }

  @Mutation(() => Prompt)
  async createPrompt(@Args("data") data: CreatePromptInput) {
    const prompt = await this.promptsService.createPrompt(
      data.name,
      data.integrationId
    );
    return prompt;
  }

  @Mutation(() => Prompt)
  async updatePrompt(@Args("data") data: PromptUpdateInput) {
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
  async createPromptVersion(@Args("data") data: CreatePromptVersionInput) {
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
