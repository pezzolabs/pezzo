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

@Resolver(() => Prompt)
export class PromptExecutionsResolver {
  constructor(
    private prisma: PrismaService,
    private readonly promptsService: PromptsService,
    private readonly promptTesterService: PromptTesterService,
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
  async reportPromptExecution(@Args("data") data: PromptExecutionCreateInput) {
    const execution = await this.prisma.promptExecution.create({
      data,
    });
    return execution;
  }

  @Mutation(() => PromptExecution)
  async testPrompt(@Args("data") data: TestPromptInput) {
    const result = await this.promptTesterService.testPrompt(data);

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
