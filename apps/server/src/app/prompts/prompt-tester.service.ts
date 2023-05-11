import { Injectable } from "@nestjs/common";
import { TestPromptInput } from "./inputs/test-prompt.input";
import { getIntegration } from "@pezzo/integrations";
import { Executor as AI21Executor } from "libs/integrations/src/lib/integrations/ai21/Executor";
import { Pezzo, TestPromptResult } from "@pezzo/client";
import { IntegrationSettings } from "libs/integrations/src/lib/integrations/ai21";
import { interpolateVariables } from "@pezzo/common";

const AI21_API_KEY = process.env.AI21_API_KEY;

@Injectable()
export class PromptTesterService {
  async testPrompt(input: TestPromptInput): Promise<TestPromptResult> {
    const { integrationId, content, variables } = input;
    const interpolatedContent = interpolateVariables(content, variables);

    const integration = getIntegration(integrationId);

    if (integration.id === "ai21") {
      const executor = new AI21Executor({} as Pezzo, { apiKey: AI21_API_KEY });
      const settings = input.settings as IntegrationSettings;

      try {
        const start = performance.now();

        const result = await executor.execute<IntegrationSettings>({
          content,
          settings,
          options: {},
        });

        const end = performance.now();
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
      } catch (error) {
        console.log("error", error);
      }
    }
  }
}
