import { OpenAIApi } from "openai";
import { extractPezzoFromArgs } from "../utils/helpers";
import { PezzoExtendedArgs } from "../types/helpers";
import { CreatePromptExecutionDto } from "./create-prompt-execution.dto";
import { Pezzo } from "./Pezzo";
import { OpenAIStream, StreamingTextResponse } from "ai";

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
    const settings = originalArgs[0];

    const baseReportPayload = {
      environmentName: _pezzo.environmentName,
      promptId: _pezzo.promptId,
      promptVersionSha: _pezzo.promptVersionSha,
      settings,
      variables: _pezzo.variables,
      content: _pezzo.content,
      interpolatedContent: _pezzo.interpolatedContent,
      promptCost: 0,
      completionCost: 0,
      totalCost: 0,
      result: null,
      error: null,
    };

    let reportPayload: CreatePromptExecutionDto;
    let originalResult;
    let originalError: unknown;
    
    const start = performance.now();

    
    try {
      originalResult = await super.createChatCompletion.call(this, ...originalArgs);
      
      // if (settings.stream === true) {
      //   console.log("STREAMING");

      //   const stream = OpenAIStream(originalResult);

      // }

    //   console.log("originalResult is here");

    //   const { usage } = originalResult.data;
    //   const end = performance.now();
    //   const duration = end - start;

    //   reportPayload = {
    //     ...baseReportPayload,
    //     status: "Success",
    //     result: JSON.stringify(originalResult.data.choices),
    //     promptTokens: usage.prompt_tokens,
    //     completionTokens: usage.completion_tokens,
    //     totalTokens: usage.prompt_tokens + usage.completion_tokens,
    //     duration,
    //   };
    // } catch (error) {
    //   originalError = error;
    //   const errorData = error.response.data;

    //   reportPayload = {
    //     ...baseReportPayload,
    //     status: "Error",
    //     error: JSON.stringify(errorData),
    //     promptTokens: 0,
    //     completionTokens: 0,
    //     totalTokens: 0,
    //     duration: 0,
    //   };
    // }

    // try {
    //   await this.pezzo.reportPromptExecutionV2(
    //     reportPayload,
    //     false
    //   );

    } catch (error) {
      console.error("Failed to report prompt execution", error.response.data);
    }

    if (originalError) {
      throw originalError;
    }

    return originalResult;
  }
}
