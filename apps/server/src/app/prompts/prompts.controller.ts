import {
  Body,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  NotFoundException,
  Param, Post,
  UseGuards,
} from "@nestjs/common";
import {ApiKeyAuthGuard} from "../auth/api-key-auth.guard";
import {PinoLogger} from "../logger/pino-logger";
import {PromptsService} from "./prompts.service";
import {Prompt} from "@prisma/client";
import {AnalyticsService} from "../analytics/analytics.service";
import {PrismaService} from "../prisma.service";
import {ApiHeader, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreatePromptVersionWithUserInput} from "./inputs/create-prompt-version-with-user.input";
import {UsersService} from "../identity/users.service";

@UseGuards(ApiKeyAuthGuard)
@ApiTags("Prompts")
@ApiHeader({
  name: "llm-ops-api-key",
  description: "anthentication header",
})
@Controller("prompts/v2")
export class PromptsController {
  constructor(
    private logger: PinoLogger,
    private prisma: PrismaService,
    private promptsService: PromptsService,
    private analytics: AnalyticsService,
    private usersService: UsersService,
  ) {}

  // @Get("/deployment")
  // @ApiOperation({
  //   summary: "Get the deployed Prompt Version to a particular Environment",
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: "Deployed prompt version object",
  // })
  // @ApiResponse({
  //   status: 404,
  //   description:
  //     "Prompt deployment not found for the specific environment name",
  // })
  // @ApiResponse({ status: 500, description: "Internal server error" })
  // async getPromptDeployment(
  //   @Query() query: GetPromptDeploymentDto,
  //   @ApiKeyOrgId() organizationId: string,
  //   @Headers() headers
  // ) {
  //   const { name, environmentName } = query;
  //   let prompt: Prompt;
  //   let projectId: string = headers["x-pezzo-project-id"] || null;
  //
  //   this.logger.assign({
  //     name,
  //     organizationId,
  //     environmentName,
  //     projectId,
  //   });
  //   this.logger.info("Getting prompt deployment");
  //
  //   try {
  //     // Backwards compatibility
  //     // https://github.com/pezzolabs/pezzo/issues/224
  //     if (projectId) {
  //       prompt = await this.prisma.prompt.findFirst({
  //         where: {
  //           name: {
  //             equals: name,
  //           },
  //           projectId,
  //         },
  //       });
  //     } else {
  //       const orgProjects = await this.prisma.project.findMany({
  //         where: { organizationId },
  //       });
  //
  //       const projectIds = orgProjects.map((p) => p.id);
  //
  //       prompt = await this.prisma.prompt.findFirst({
  //         where: {
  //           name: {
  //             equals: name,
  //           },
  //           projectId: {
  //             in: projectIds,
  //           },
  //         },
  //       });
  //
  //       projectId = prompt.projectId;
  //     }
  //   } catch (error) {
  //     this.logger.error({ error }, "Error finding prompt with API key");
  //     throw new InternalServerErrorException();
  //   }
  //
  //   if (!prompt) {
  //     throw new NotFoundException(`Prompt "${name}" not found`);
  //   }
  //
  //   this.analytics.trackEvent("prompt_find_with_api_key", {
  //     organizationId,
  //     projectId,
  //     promptId: prompt.id,
  //   });
  //
  //   const environment = await this.prisma.environment.findFirst({
  //     where: { name: environmentName, projectId },
  //   });
  //
  //   if (!environment) {
  //     throw new NotFoundException(
  //       "Could not find environment matching the provided name and project ID"
  //     );
  //   }
  //
  //   let deployedPrompt: PromptEnvironment;
  //
  //   try {
  //     deployedPrompt = await this.prisma.promptEnvironment.findFirst({
  //       where: { promptId: prompt.id, environmentId: environment.id },
  //       orderBy: { createdAt: "desc" },
  //     });
  //   } catch (error) {
  //     this.logger.error({ error }, "Error getting deployed prompt");
  //     throw new InternalServerErrorException();
  //   }
  //
  //   if (!deployedPrompt) {
  //     throw new NotFoundException(
  //       `Prompt was not deployed to this environment`
  //     );
  //   }
  //
  //   let promptVersion: PromptVersion;
  //
  //   try {
  //     promptVersion = await this.promptsService.getPromptVersion(
  //       deployedPrompt.promptVersionSha
  //     );
  //   } catch (error) {
  //     this.logger.error({ error }, "Error getting prompt version");
  //     throw new InternalServerErrorException();
  //   }
  //
  //   return {
  //     promptId: prompt.id,
  //     promptVersionSha: promptVersion.sha,
  //     settings: promptVersion.settings,
  //     content: promptVersion.content,
  //   };
  // }

  @Get("/models")
  @ApiOperation({
    summary: "Get the model list",
  })
  @ApiResponse({
    status: 200,
    description: "Get model list successfully",
  })
  @ApiResponse({
    status: 404,
    description:
      "Not found for the model list",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getModelList(
    @Headers() headers
  ) {
    this.logger.info("Getting GAI platform models");

    try {
      return await this.promptsService.getModels();
    } catch (error) {
      this.logger.error({ error }, "Error getting GAI platform models");
      throw new InternalServerErrorException();
    }
  }

  @Get("/:promptId/latest")
  @ApiOperation({
    summary: "Get the specific prompt latest version",
  })
  @ApiResponse({
    status: 200,
    description: "Get the specific prompt latest version successfully",
  })
  @ApiResponse({
    status: 404,
    description:
      "Not found for the specific prompt latest version",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getPromptLatestVersion(@Param("promptId") promptId: string) {
    this.logger.info("Getting specific prompt latest version");

    try {
      return await this.promptsService.getLatestPromptVersion(promptId);
    } catch (error) {
      this.logger.error({ error }, "Error getting specific prompt latest version");
      throw new InternalServerErrorException();
    }
  }

  @Get("/:promptId/versions")
  @ApiOperation({
    summary: "Get the specific prompt all versions",
  })
  @ApiResponse({
    status: 200,
    description: "Get the specific prompt all versions by SHA successfully",
  })
  @ApiResponse({
    status: 404,
    description:
      "Not found for the specific prompt all versions",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getSpecificPromptVersions(@Param("promptId") promptId: string) {
    this.logger.info("Getting specific prompt all versions");

    let prompt: Prompt;

    try {
      prompt = await this.promptsService.getPrompt(promptId);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException();
    }

    let promptVersions;

    try {
      promptVersions = await this.promptsService.getPromptVersions(promptId);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt versions");
      throw new InternalServerErrorException();
    }

    const versions = [];
    promptVersions.forEach((version) => {
      versions.push({
        sha: version.sha,
        message: version.message,
        createdAt: version.createdAt,
      });
    });

    return versions;
  }

  @Get("/version/:sha")
  @ApiOperation({
    summary: "Get the specific prompt version by SHA",
  })
  @ApiResponse({
    status: 200,
    description: "Get the specific prompt version by SHA successfully",
  })
  @ApiResponse({
    status: 404,
    description:
      "Not found for the specific prompt specific version",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getPromptSpecificVersion(@Param("sha") sha: string) {
    this.logger.info("Getting specific prompt version by SHA");

    try {
      return await this.promptsService.getPromptVersion(sha);
    } catch (error) {
      this.logger.error({ error }, "Error getting specific prompt version by SHA");
      throw new InternalServerErrorException();
    }
  }

  @Get("/:projectId/all")
  @ApiOperation({
    summary: "Get all the prompts in specific project",
  })
  @ApiResponse({
    status: 200,
    description: "Get all the prompts in specific project successfully",
  })
  @ApiResponse({
    status: 404,
    description:
      "Not found for all the prompts in specific project",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getAllPrompts(@Param("projectId") projectId: string) {
    this.logger.info("Getting all the prompts in specific project");

    try {
      return await this.promptsService.getAllPrompts(projectId);
    } catch (error) {
      this.logger.error({ error }, "Error getting specific project all prompts");
      throw new InternalServerErrorException();
    }
  }

  @Post("/promptVersion")
  @ApiOperation({ summary: "Commit specific prompt new version" })
  @ApiResponse({
    status: 200,
    description: "Commit specific prompt new version successfully",
  })
  @ApiResponse({
    status: 404,
    description:
      "Not found for the specific prompt Id",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async createPromptVersion(
    @Body() dto: CreatePromptVersionWithUserInput,
  ) {
    this.logger
      .assign({
        promptId: dto.promptId,
      })
      .info("Creating prompt version");

    // check if prompt exist
    let prompt: Prompt;
    try {
      prompt = await this.promptsService.getPrompt(dto.promptId);
    } catch (error) {
      this.logger.error({ error }, "Error getting existing prompt");
      throw new InternalServerErrorException();
    }
    if (!prompt) {
      throw new NotFoundException();
    }

    // check if user exist
    let user;
    try {
      user = await this.usersService.getUserByEmail(dto.userEmail);
    } catch (error) {
      this.logger.error({ error }, "Error getting user");
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new NotFoundException();
    }

    try {
      const promptVersion = await this.promptsService.createPromptVersion(
        dto,
        user.id
      );
      this.analytics.trackEvent("prompt_version_created", {
        projectId: prompt.projectId,
        promptId: prompt.id,
      });
      return promptVersion;
    } catch (error) {
      this.logger.error({ error }, "Error creating prompt version");
      throw new InternalServerErrorException();
    }
  }
}
