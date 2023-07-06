import { ForbiddenException, Injectable } from "@nestjs/common";
import { TestPromptInput } from "./inputs/test-prompt.input";
import { getIntegration } from "@pezzo/integrations";
import { OpenAIExecutor, AI21Executor } from "@pezzo/integrations";
import { Pezzo, TestPromptResult } from "@pezzo/client";
import { ProviderApiKeysService } from "../credentials/provider-api-keys.service";
import { interpolateVariables } from "@pezzo/integrations/lib/utils/interpolate-variables";

const noop = {} as Pezzo;
@Injectable()
export class PromptTesterService {
  constructor(private providerAPIKeysService: ProviderApiKeysService) {}

  private async executorFactory(integrationId: string, organizationId: string) {
    const { provider } = getIntegration(integrationId);
    const apiKey = await this.providerAPIKeysService.getByProvider(
      provider,
      organizationId
    );

    if (!apiKey) {
      throw new ForbiddenException(`No valid API key found for ${provider}`);
    }

    switch (integrationId) {
      case "openai":
        return new OpenAIExecutor(noop, { apiKey: apiKey.value });
      case "ai21":
        return new AI21Executor(noop, { apiKey: apiKey.value });
    }
  }

  async testPrompt(
    input: TestPromptInput,
    organizationId: string
  ): Promise<TestPromptResult> {
    const { integrationId, content, variables } = input;
    const interpolatedContent = interpolateVariables(content, variables);
    const executor = await this.executorFactory(integrationId, organizationId);
    const settings = input.settings;

    const start = performance.now();
    const result = await executor.execute({
      content: interpolatedContent,
      settings: settings as never,
      options: {},
    });
    const end = performance.now();

    const duration = Math.ceil(end - start);

    return {
      ...result,
      error: result?.error ? result.error.printableError : null,
      success: !result?.error,
      content,
      interpolatedContent,
      duration,
      settings,
      variables,
      totalTokens: 0,
      totalCost: 0,
    };
  }
}
