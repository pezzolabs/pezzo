import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Prompt } from "../../@generated/prompt/prompt.model";
import { PrismaService } from "../prisma.service";
import { PromptExecution } from "../../@generated/prompt-execution/prompt-execution.model";
import { PromptExecutionCreateInput } from "../../@generated/prompt-execution/prompt-execution-create.input";
import { PromptExecutionWhereInput } from "../../@generated/prompt-execution/prompt-execution-where.input";
import { PromptExecutionWhereUniqueInput } from "../../@generated/prompt-execution/prompt-execution-where-unique.input";
import { PromptExecutionStatus } from "../../@generated/prisma/prompt-execution-status.enum";
import { TestPromptInput } from "./inputs/test-prompt.input";
import { PromptsService } from "./prompts.service";
import { PromptTesterService } from "./prompt-tester.service";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { AuthGuard } from "../auth/auth.guard";
import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { ApiKeyProjectId } from "../identity/api-key-project-id.decorator";
import { isProjectMemberOrThrow } from "../identity/identity.utils";
import { InfluxDbService } from "../influxdb/influxdb.service";
import { Point } from "@influxdata/influxdb-client";

@UseGuards(AuthGuard)
@Resolver(() => Prompt)
export class PromptExecutionsResolver {
  constructor(
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private promptTesterService: PromptTesterService,
    private influxService: InfluxDbService
  ) {}

  @Query(() => PromptExecution)
  async promptExecution(
    @Args("data") data: PromptExecutionWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const promptExecution = await this.prisma.promptExecution.findUnique({
      where: data,
    });

    if (!promptExecution) {
      throw new NotFoundException();
    }

    const prompt = await this.promptsService.getPrompt(
      promptExecution.promptId
    );

    isProjectMemberOrThrow(user, prompt.projectId);

    return promptExecution;
  }

  @Query(() => [PromptExecution])
  async promptExecutions(
    @Args("data") data: PromptExecutionWhereInput,
    @CurrentUser() user: RequestUser
  ) {
    const promptId = data.promptId.equals;
    const prompt = await this.promptsService.getPrompt(promptId);

    if (!prompt) {
      throw new NotFoundException();
    }

    isProjectMemberOrThrow(user, prompt.projectId);

    const executions = await this.prisma.promptExecution.findMany({
      where: data,
      orderBy: {
        timestamp: "desc",
      },
    });

    return executions;
  }

  @Mutation(() => PromptExecution)
  async reportPromptExecutionWithApiKey(
    @Args("data") data: PromptExecutionCreateInput,
    @ApiKeyProjectId() projectId: string
  ) {
    const promptId = data.prompt.connect.id;
    const prompt = await this.promptsService.getPrompt(promptId);

    if (!prompt) {
      throw new NotFoundException();
    }

    if (prompt.projectId !== projectId) {
      throw new ForbiddenException();
    }

    const execution = await this.prisma.promptExecution.create({
      data,
    });

    const writeClient = this.influxService.getWriteApi("primary", "primary");
    const point = new Point("prompt_execution")
      .tag("prompt_id", execution.promptId)
      .tag("prompt_version_sha", execution.promptVersionSha)
      .tag("project_id", prompt.projectId)
      .tag("prompt_name", prompt.name)
      .tag("prompt_integration_id", prompt.integrationId)
      .stringField("status", execution.status)
      .floatField("duration", execution.duration / 1000)
      .floatField("prompt_cost", execution.promptCost)
      .floatField("completion_cost", execution.completionCost)
      .floatField("total_cost", execution.totalCost)
      .intField("prompt_tokens", execution.promptTokens)
      .intField("completion_tokens", execution.completionTokens)
      .intField("total_tokens", execution.totalTokens);

    writeClient.writePoint(point);
    writeClient.flush();

    return execution;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PromptExecution)
  async testPrompt(
    @Args("data") data: TestPromptInput,
    @CurrentUser() user: RequestUser
  ) {
    isProjectMemberOrThrow(user, data.projectId);

    const result = await this.promptTesterService.testPrompt(
      data,
      data.projectId
    );

    const execution = new PromptExecution();
    execution.id = "test";
    execution.prompt = null;
    execution.promptId = "test";
    execution.timestamp = new Date();
    execution.status = result.success
      ? PromptExecutionStatus.Success
      : PromptExecutionStatus.Error;
    execution.content = result.content;
    execution.interpolatedContent = result.interpolatedContent;
    execution.settings = result.settings;
    execution.result = result.result;
    execution.duration = result.duration;
    execution.promptTokens = result.promptTokens;
    execution.completionTokens = result.completionTokens;
    execution.totalTokens = result.totalTokens;
    execution.promptCost = result.promptCost;
    execution.completionCost = result.completionCost;
    execution.totalCost = result.totalCost;
    execution.error = result.error;
    execution.variables = result.variables;

    return execution;
  }
}
