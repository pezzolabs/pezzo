import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Prompt } from "../../@generated/prompt/prompt.model";
import { PrismaService } from "../prisma.service";
import { PromptExecution } from "../../@generated/prompt-execution/prompt-execution.model";
import { PromptExecutionWhereInput } from "../../@generated/prompt-execution/prompt-execution-where.input";
import { PromptExecutionWhereUniqueInput } from "../../@generated/prompt-execution/prompt-execution-where-unique.input";
import { PromptExecutionStatus } from "../../@generated/prisma/prompt-execution-status.enum";
import { TestPromptInput } from "./inputs/test-prompt.input";
import { PromptsService } from "./prompts.service";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { AuthGuard } from "../auth/auth.guard";
import {
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { AnalyticsService } from "../analytics/analytics.service";
import { PinoLogger } from "../logger/pino-logger";
import { TestPromptResult } from "@pezzo/client";

@UseGuards(AuthGuard)
@Resolver(() => Prompt)
export class PromptExecutionsResolver {
  constructor(
    private prisma: PrismaService,
    private promptsService: PromptsService,
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

    const project = await this.prisma.project.findUnique({
      where: {
        id: prompt.projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);
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

    const project = await this.prisma.project.findUnique({
      where: {
        id: prompt.projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

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
}
