import { CreateChatCompletionRequest, OpenAIApi } from "openai";
import { extractPezzoFromArgs } from "../utils/helpers";
import { PezzoExtendedArgs } from "../types/helpers";
import { CreatePromptExecutionDto } from "./create-prompt-execution.dto";
import { Pezzo } from "./Pezzo";

export interface ExecuteResult {
  status: "Success" | "Error";
  promptTokens: number;
  completionTokens: number;
  promptCost: number;
  completionCost: number;
  error?: {
    error: unknown;
    message?: string;
    printableError: string;
    status: number;
  };
  result?: unknown;
}

export class PezzoOpenAIApi extends OpenAIApi {
  constructor(
    private readonly pezzo: Pezzo,
    ...args: ConstructorParameters<typeof OpenAIApi>
  ) {
    super(...args);
  }

  override async createChatCompletion(
    ...args: PezzoExtendedArgs<Parameters<OpenAIApi["createChatCompletion"]>>
  ) {
    const { _pezzo, originalArgs } = extractPezzoFromArgs(args);
    
    const start = performance.now();
    const result = await super.createChatCompletion.call(this, ...originalArgs);

    const end = performance.now();
    const duration = end - start;

    const reportPayload: CreatePromptExecutionDto = 
      {
        environmentName: _pezzo.environmentName,
        promptId: _pezzo.promptId,
        promptVersionSha: _pezzo.promptVersionSha,
        status: "Success",
        settings: originalArgs[0],
        variables: _pezzo.variables,
        content: _pezzo.content,
        interpolatedContent: _pezzo.interpolatedContent,
        result: null,
        error: null,
        duration,
        completionCost: 0,
        completionTokens: 0,
        promptCost: 0,
        promptTokens: 0,
        totalTokens: 0,
        totalCost: 0,
      };

    try {
      await this.pezzo.reportPromptExecution(
        reportPayload,
        false
      );

    } catch (error) {
      console.error("Failed to report prompt execution", error.response.data);
    }

    return result;
  }
}
