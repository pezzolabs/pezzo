import { OpenAIApi } from "openai";
import { extractPezzoFromArgs } from "../utils/helpers";
import { PezzoExtendedArgs } from "../types/helpers";

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
  public reportFn: (smth: any) => any = () => "";

  constructor(...args) {
    super(...args);
  }

  override async createChatCompletion(
    ...args: PezzoExtendedArgs<Parameters<OpenAIApi["createChatCompletion"]>>
  ) {
    // Parameters<OpenAIApi["createChatCompletion"]>
    const { pezzo, trimmedArgs } = extractPezzoFromArgs(args);
    const start = performance.now();
    const result = await super.createChatCompletion.call(this, ...trimmedArgs);

    const end = performance.now();
    const duration = end - start;

    this.reportFn(duration);

    const { usage } = result.data;

    const promptTokens = usage.prompt_tokens;
    const completionTokens = usage.completion_tokens;
    const promptCost = 0;
    const completionCost = 0;

    let executionResult: ExecuteResult;

    // success
    // executionResult = {
    //   status: "Success",
    //   promptTokens,
    //   completionTokens,
    //   promptCost,
    //   completionCost,
    //   result: result.data.choices[0]?.message.content,
    // }

    // report
    return result;
  }
}
