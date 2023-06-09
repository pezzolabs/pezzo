import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
} from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { PinoLogger } from "../logger/pino-logger";
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
import { ApiKeyOrgId } from "../identity/api-key-org-id.decoator";
import { GetPromptDeploymentDto } from "./dto/get-prompt-deployment.dto";

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

  @Get("/deployment")
  async getPromptDeployment(
    @Query() query: GetPromptDeploymentDto,
    @ApiKeyOrgId() organizationId: string
  ) {
    const { name, environmentName } = query;
    this.logger.info(
      { name, organizationId, environmentName },
      "Getting prompt deployment"
    );
    let prompt: Prompt;

    const orgProjects = await this.prisma.project.findMany({
      where: { organizationId },
    });

    const projectIds = orgProjects.map((p) => p.id);
    let projectId: string;

    try {
      prompt = await this.prisma.prompt.findFirst({
        where: {
          name: {
            equals: name,
          },
          projectId: {
            in: projectIds,
          },
        },
      });

      console.log("prompt", prompt);

      projectId = prompt.projectId;
    } catch (error) {
      this.logger.error({ error }, "Error finding prompt with API key");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException(`Prompt "${name}" not found`);
    }

    this.analytics.track("PROMPT:FIND_WITH_API_KEY", "api", {
      organizationId,
      projectId,
      promptId: prompt.id,
    });

    const environment = await this.prisma.environment.findFirst({
      where: { name: environmentName, projectId },
    });

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
    @ApiKeyOrgId() organizationId: string
  ): Promise<{ success: boolean }> {
    this.logger.info({ ...data, organizationId }, "Reporting prompt execution");
    const { promptId, environmentName } = data;

    const prompt = await this.promptsService.getPrompt(promptId);

    if (!prompt) {
      throw new NotFoundException();
    }

    const project = await this.prisma.project.findUnique({
      where: { id: prompt.projectId },
    });

    if (organizationId !== project.organizationId) {
      throw new ForbiddenException();
    }

    const environment = await this.prisma.environment.findFirst({
      where: { name: environmentName, projectId: prompt.projectId },
    });

    let execution: PromptExecution;

    try {
      execution = await this.prisma.promptExecution.create({
        data: {
          environmentId: environment.id,
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
      projectId: project.id,
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
