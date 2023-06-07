import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { PinoLogger } from "../logger/pino-logger";
import { ApiKeyProjectId } from "../identity/api-key-project-id.decorator";
import { ApiKeyEnvironmentId } from "../identity/api-key-environment-id.dedocator";
import { CreatePromptExecutionDto } from "@pezzo/common";
import { PromptsService } from "./prompts.service";
import {
  Prompt,
  PromptEnvironment,
  PromptExecution,
  PromptVersion,
} from "@prisma/client";
import { InfluxDbService } from "../influxdb/influxdb.service";
import { AnalyticsService } from "../analytics/analytics.service";
import { PrismaService } from "../prisma.service";
import { Point } from "@influxdata/influxdb-client";

@UseGuards(ApiKeyAuthGuard)
@Controller("prompts")
export class PromptsController {
  constructor(
    private logger: PinoLogger,
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private influxService: InfluxDbService,
    private analytics: AnalyticsService
  ) {}

  @Get("/:name/deployment")
  async getPromptDeployment(
    @Param("name") name: string,
    @ApiKeyProjectId() projectId: string,
    @ApiKeyEnvironmentId() environmentId: string
  ) {
    this.logger.info(
      { name, projectId, environmentId },
      "Getting prompt deployment"
    );
    let prompt: Prompt;

    try {
      prompt = await this.prisma.prompt.findFirst({
        where: {
          name,
          projectId,
        },
      });
    } catch (error) {
      this.logger.error({ error }, "Error finding prompt with API key");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException(`Prompt "${name}" not found`);
    }

    this.analytics.track("PROMPT:FIND_WITH_API_KEY", "api", {
      projectId,
      promptId: prompt.id,
    });

    let deployedPrompt: PromptEnvironment;

    try {
      deployedPrompt = await this.prisma.promptEnvironment.findFirst({
        where: { promptId: prompt.id, environmentId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.logger.error({ error }, "Error getting deployed prompt environment");
      throw new InternalServerErrorException();
    }

    if (!deployedPrompt) {
      throw new NotFoundException(
        `Prompt was not deployed to this environment`
      );
    }

    let promptVersion: PromptVersion;

    try {
      promptVersion = await this.promptsService.getPromptVersion(
        deployedPrompt.promptVersionSha
      );
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt version");
      throw new InternalServerErrorException();
    }

    return promptVersion;
  }

  @Post("execution")
  async createPromptExecution(
    @Body() data: CreatePromptExecutionDto,
    @ApiKeyProjectId() projectId: string,
    @ApiKeyEnvironmentId() environmentId: string
  ): Promise<{ success: boolean }> {
    this.logger.info(
      { ...data, projectId, environmentId },
      "Reporting prompt execution"
    );
    const { promptId } = data;
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
          environmentId,
          prompt: { connect: { id: promptId } },
          promptVersionSha: data.promptVersionSha,
          timestamp: new Date(),
          status: data.status,
          content: data.content,
          interpolatedContent: data.interpolatedContent,
          settings: data.settings as any,
          result: data.result,
          duration: data.duration,
          promptTokens: data.promptTokens,
          completionTokens: data.completionTokens,
          totalTokens: data.totalTokens,
          promptCost: data.promptCost,
          completionCost: data.completionCost,
          totalCost: data.totalCost,
          error: data.error,
          variables: data.variables as any,
        },
      });
    } catch (error) {
      this.logger.error({ error }, "Error reporting prompt execution");
      return { success: false };
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

    try {
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
    } catch (error) {
      this.logger.error(
        { error },
        "Error reporting prompt execution to influxdb"
      );
      return { success: false };
    }

    return { success: true };
  }
}
