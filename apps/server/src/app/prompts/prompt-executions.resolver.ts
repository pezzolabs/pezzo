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
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { ApiKeyProjectId } from "../identity/api-key-project-id.decorator";
import { isProjectMemberOrThrow } from "../identity/identity.utils";
import { InfluxDbService } from "../influxdb/influxdb.service";
import { Point } from "@influxdata/influxdb-client";
import { AnalyticsService } from "../analytics/analytics.service";
import { PinoLogger } from "../logger/pino-logger";
import { TestPromptResult } from "@pezzo/client";

@UseGuards(AuthGuard)
@Resolver(() => Prompt)
export class PromptExecutionsResolver {
  constructor(
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private promptTesterService: PromptTesterService,
    private influxService: InfluxDbService,
    private logger: PinoLogger,
    private analytics: AnalyticsService
  ) {}

  @Query(() => PromptExecution)
  async promptExecution(
    @Args("data") data: PromptExecutionWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const { id } = data;
    this.logger.assign({ id }).info("Getting prompt execution");

    let promptExecution: PromptExecution;

    try {
      promptExecution = await this.prisma.promptExecution.findUnique({
        where: data,
      });
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt execution");
      throw new NotFoundException();
    }

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
    this.logger.assign({ ...data }).info("Getting prompt executions");
    const promptId = data.promptId.equals;
    const prompt = await this.promptsService.getPrompt(promptId);

    if (!prompt) {
      throw new NotFoundException();
    }

    isProjectMemberOrThrow(user, prompt.projectId);

    try {
      const executions = await this.prisma.promptExecution.findMany({
        where: data,
        orderBy: {
          timestamp: "desc",
        },
      });
      return executions;
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt executions");
      throw new NotFoundException();
    }
  }

  @Mutation(() => PromptExecution)
  async reportPromptExecutionWithApiKey(
    @Args("data") data: PromptExecutionCreateInput,
    @ApiKeyProjectId() projectId: string
  ) {
    this.logger.assign({ ...data }).info("Reporting prompt execution");
    const promptId = data.prompt.connect.id;
    const prompt = await this.promptsService.getPrompt(promptId);

    if (!prompt) {
      throw new NotFoundException();
    }

    if (prompt.projectId !== projectId) {
      throw new ForbiddenException();
    }

    let execution: PromptExecution;

    try {
      execution = await this.prisma.promptExecution.create({
        data: {
          prompt: data.prompt,
          promptVersionSha: data.promptVersionSha,
          timestamp: data.timestamp,
          status: data.status,
          content: data.content,
          interpolatedContent: data.interpolatedContent,
          settings: data.settings,
          result: data.result,
          duration: data.duration,
          promptTokens: data.promptTokens,
          completionTokens: data.completionTokens,
          totalTokens: data.totalTokens,
          promptCost: data.promptCost,
          completionCost: data.completionCost,
          totalCost: data.totalCost,
          error: data.error,
          variables: data.variables,
        },
      });
    } catch (error) {
      this.logger.error({ error }, "Error reporting prompt execution");
      throw new InternalServerErrorException();
    }

    this.analytics.track("PROMPT_EXECUTION:REPORTED", "api", {
      projectId,
      promptId,
      executionId: execution.id,
      integrationId: prompt.integrationId,
      data: {
        status: execution.status,
        duration: execution.duration / 1000,
      },
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
    this.logger
      .assign({
        projectId: data.projectId,
        integrationId: data.integrationId,
        settings: data.settings,
      })
      .info("Testing prompt");
    isProjectMemberOrThrow(user, data.projectId);

    let result: TestPromptResult;

    try {
      result = await this.promptTesterService.testPrompt(data, data.projectId);
    } catch (error) {
      this.logger.error({ error }, "Error testing prompt");
      throw new InternalServerErrorException();
    }

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

    this.analytics.track("PROMPT:TESTED", user.id, {
      projectId: data.projectId,
      integrationId: data.integrationId,
      executionId: "test",
      data: {
        status: execution.status,
        duration: execution.duration / 1000,
      },
    });

    return execution;
  }
}
