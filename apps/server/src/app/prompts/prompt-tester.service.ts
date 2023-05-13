import { ForbiddenException, Injectable } from "@nestjs/common";
import { TestPromptInput } from "./inputs/test-prompt.input";
import { getIntegration } from "@pezzo/integrations";
import { Executor as OpenAIExecutor } from "@pezzo/integrations/lib/integrations/openai/Executor";
import { Executor as AI21Executor } from "@pezzo/integrations/lib/integrations/ai21/Executor";
import { Pezzo, TestPromptResult } from "@pezzo/client";
import { interpolateVariables } from "@pezzo/common";
import { ExecuteResult } from "@pezzo/integrations/lib/integrations/BaseExecutor";
import { ProviderApiKeysService } from "../credentials/provider-api-keys.service";

@Injectable()
export class PromptTesterService {
  constructor(private providerAPIKeysService: ProviderApiKeysService) {}

  private async getExecutor(integrationId: string, organizationId: string) {
    let executor;

    const { provider } = getIntegration(integrationId);
    const apiKey = await this.providerAPIKeysService.getByProvider(provider, organizationId);

    if (!apiKey) {
      throw new ForbiddenException(`No valid API key found for ${provider}`);
    }

    if (integrationId === "openai") {
      executor = new OpenAIExecutor({} as Pezzo, { apiKey: apiKey.value });
    }
    if (integrationId === "ai21") {
      executor = new AI21Executor({} as Pezzo, { apiKey: apiKey.value });
    }

    return executor;
  }

  async testPrompt(input: TestPromptInput, organizationId: string): Promise<TestPromptResult> {
    const { integrationId, content, variables } = input;
    const interpolatedContent = interpolateVariables(content, variables);

    const executor = await this.getExecutor(integrationId, organizationId);
    const settings = input.settings;
    let start: number, end: number;
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
      return {
        success: false,
        result: null,
        error: JSON.stringify(error.response.data),
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        promptCost: 0,
        completionCost: 0,
        totalCost: 0,
        duration: 0,
        content,
        interpolatedContent,
        settings,
        variables,
      };
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
