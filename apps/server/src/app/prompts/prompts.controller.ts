import {
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { PinoLogger } from "../logger/pino-logger";
import { PromptsService } from "./prompts.service";
import {
  Prompt,
  PromptEnvironment,
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
  @ApiOperation({ summary: "Get the deployed Prompt Version to a particular Environment" })
  @ApiResponse({
    status: 200,
    description: "Deployed prompt version object"
  })
  @ApiResponse({ status: 404, description: "Prompt deployment not found for the specific environment name" })
  @ApiResponse({ status: 500, description: "Internal server error" })
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
}
