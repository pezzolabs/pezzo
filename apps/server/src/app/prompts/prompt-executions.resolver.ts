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
import { ApiKeyOrgId } from "../identity/api-key-org-id";

@UseGuards(AuthGuard)
@Resolver(() => Prompt)
export class PromptExecutionsResolver {
  constructor(
    private prisma: PrismaService,
    private readonly promptsService: PromptsService,
    private readonly promptTesterService: PromptTesterService
  ) {}

  @Query(() => PromptExecution)
  async promptExecution(@Args("data") data: PromptExecutionWhereUniqueInput) {
    const prompt = await this.prisma.promptExecution.findUnique({
      where: data,
    });
    return prompt;
  }

  @Query(() => [PromptExecution])
  async promptExecutions(@Args("data") data: PromptExecutionWhereInput) {
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
    @ApiKeyOrgId() orgId: string
  ) {
    const promptId = data.prompt.connect.id;

    const prompt = await this.promptsService.getPrompt(promptId);

    if (!prompt) {
      throw new NotFoundException();
    }

    if (prompt.organizationId !== orgId) {
      throw new ForbiddenException();
    }

    const execution = await this.prisma.promptExecution.create({
      data,
    });
    return execution;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PromptExecution)
  async testPrompt(
    @Args("data") data: TestPromptInput,
    @CurrentUser() user: RequestUser
  ) {
    const result = await this.promptTesterService.testPrompt(
      data,
      user.orgMemberships[0].organizationId
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
