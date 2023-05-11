import { Injectable } from "@nestjs/common";
import { TestPromptInput } from "./inputs/test-prompt.input";
import { getIntegration } from "@pezzo/integrations";
import { Executor as OpenAIExecutor } from "@pezzo/integrations/lib/integrations/openai/Executor";
import { Executor as AI21Executor } from "@pezzo/integrations/lib/integrations/ai21/Executor";
import { Pezzo, TestPromptResult } from "@pezzo/client";
import { interpolateVariables } from "@pezzo/common";
import { ExecuteResult } from "@pezzo/integrations/lib/integrations/BaseExecutor";

const AI21_API_KEY = process.env.AI21_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

@Injectable()
export class PromptTesterService {
  private getExecutor(integrationId: string) {
    let executor;

    if (integrationId === "openai") {
      executor = new OpenAIExecutor({} as Pezzo, { apiKey: OPENAI_API_KEY });
    }
    if (integrationId === "ai21") {
      executor = new AI21Executor({} as Pezzo, { apiKey: AI21_API_KEY });
    }

    return executor;
  }

  async testPrompt(input: TestPromptInput): Promise<TestPromptResult> {
    const { integrationId, content, variables } = input;
    const interpolatedContent = interpolateVariables(content, variables);

    const executor = this.getExecutor(integrationId);
    let start, end;
    let settings = input.settings;
    let result: ExecuteResult<any>;

    try {
      start = performance.now();
      result = await executor.execute({
        content,
        settings: settings as any,
        options: {},
      });
      end = performance.now();
    } catch (error) {
      console.log("error", error);
    }

    const duration = Math.ceil(end - start);

    return {
      success: true,
      result: result.result,
      error: null,
      content,
      interpolatedContent,
      settings,
      duration,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      totalTokens: result.promptTokens + result.completionTokens,
      promptCost: result.promptCost,
      completionCost: result.completionCost,
      totalCost: result.promptCost + result.completionCost,
      variables,
    };
  }
}
