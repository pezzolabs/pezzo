import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
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
import { AnalyticsService } from "../analytics/analytics.service";
import { PrismaService } from "../prisma.service";
import { ApiKeyOrgId } from "../identity/api-key-org-id.decoator";
import { GetPromptDeploymentDto } from "./dto/get-prompt-deployment.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@UseGuards(ApiKeyAuthGuard)
@ApiTags("Prompts")
@Controller("prompts/v2")
export class PromptsController {
  constructor(
    private logger: PinoLogger,
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private analytics: AnalyticsService
  ) {}

  @Get("/deployment")
  @ApiOperation({ summary: "Get prompt deployment" })
  @ApiResponse({
    status: 200,
    description: "Returns the prompt deployment data.",
  })
  @ApiResponse({ status: 404, description: "Prompt deployment not found." })
  async getPromptDeployment(
    @Query() query: GetPromptDeploymentDto,
    @ApiKeyOrgId() organizationId: string,
    @Headers() headers,
  ) {
    const { name, environmentName } = query;
    let prompt: Prompt;
    let projectId: string = headers["x-pezzo-project-id"] || null;

    this.logger.assign({
      name,
      organizationId,
      environmentName,
      projectId,
    });
    this.logger.info("Getting prompt deployment");

    try {
      // Backwards compatibility
      // https://github.com/pezzolabs/pezzo/issues/224
      if (projectId) {
        prompt = await this.prisma.prompt.findFirst({
          where: {
            name: {
              equals: name,
            },
            projectId,
          },
        });
      } else {
        const orgProjects = await this.prisma.project.findMany({
          where: { organizationId },
        });

        const projectIds = orgProjects.map((p) => p.id);

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

        projectId = prompt.projectId;
      }
    } catch (error) {
      this.logger.error({ error }, "Error finding prompt with API key");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException(`Prompt "${name}" not found`);
    }

    this.analytics.trackEvent("prompt_find_with_api_key", {
      organizationId,
      projectId,
      promptId: prompt.id,
    });

    const environment = await this.prisma.environment.findFirst({
      where: { name: environmentName, projectId },
    });

    if (!environment) {
      throw new NotFoundException(
        "Could not find environment matching the provided name and project ID"
      );
    }

    let deployedPrompt: PromptEnvironment;

    try {
      deployedPrompt = await this.prisma.promptEnvironment.findFirst({
        where: { promptId: prompt.id, environmentId: environment.id },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.logger.error({ error }, "Error getting deployed prompt");
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

    return {
      promptId: prompt.id,
      promptVersionSha: promptVersion.sha,
      settings: promptVersion.settings,
      content: promptVersion.content,
    };
  }

  @Post("execution")
  @ApiOperation({ summary: "Create prompt execution" })
  @ApiResponse({
    status: 200,
    description: "Successfully created the prompt execution.",
  })
  async createPromptExecution(
    @Body() dto: CreatePromptExecutionDto,
    @ApiKeyOrgId() organizationId: string
  ): Promise<{ success: boolean }> {
    this.logger.info({ ...dto, organizationId }, "Reporting prompt execution");
    const { promptId, environmentName } = dto;

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
          promptVersionSha: dto.promptVersionSha,
          timestamp: new Date(),
          status: dto.status,
          content: dto.content,
          interpolatedContent: dto.interpolatedContent,
          settings: dto.settings as any,
          result: dto.result,
          duration: dto.duration,
          promptTokens: dto.promptTokens,
          completionTokens: dto.completionTokens,
          totalTokens: dto.totalTokens,
          promptCost: dto.promptCost,
          completionCost: dto.completionCost,
          totalCost: dto.totalCost,
          error: dto.error,
          variables: dto.variables as any,
        },
      });
    } catch (error) {
      this.logger.error({ error }, "Error reporting prompt execution");
      return { success: false };
    }

    this.analytics.trackEvent("prompt_execution_reported", {
      projectId: project.id,
      promptId,
      executionId: execution.id,
      data: {
        status: execution.status,
        duration: execution.duration / 1000,
      },
    });

    return { success: true };
  }
}
