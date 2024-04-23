import { Injectable } from "@nestjs/common";
import { TestPromptInput } from "../prompts/inputs/test-prompt.input";
import {GetPromptCompletionResult, Pezzo, PezzoOpenAI} from "@pezzo/client";
import { ReportingService } from "../reporting/reporting.service";
import { ProviderApiKeysService } from "../credentials/provider-api-keys.service";
import { SerializedReport } from "@pezzo/types";
import { GaiPlatform } from "@pezzo/client";
import {log} from "next/dist/server/typescript/utils";

@Injectable()
export class PromptTesterService {
  constructor(
    private reportingService: ReportingService,
    private providerApiKeysService: ProviderApiKeysService
  ) {}

  async runTest(
    testData: TestPromptInput,
    projectId: string,
    organizationId: string
  ): Promise<SerializedReport> {
    const provider = "OpenAI";
    const providerApiKey = await this.providerApiKeysService.getByProvider(
      provider,
      organizationId
    );

    const testerApiKey =
      await this.providerApiKeysService.decryptProviderApiKey(providerApiKey);

    console.log("api-key: " + testerApiKey);

    let promptExecutionData;

    const mockPezzo = {
      options: {
        environment: "PEZZO_TESTER",
      },
      reportPromptExecution: (data) => (promptExecutionData = data),
    };

    const pezzoOpenAI = new PezzoOpenAI(mockPezzo as unknown as Pezzo, {
      apiKey: testerApiKey,
    });

    const mockRequest: any = {
      pezzo: {
        metadata: {
          promptId: testData.promptId,
          promptVersionSha: "test-prompt",
          type: "Prompt" as any,
          isTestPrompt: true,
        },
        settings: testData.settings,
        content: testData.content,
        type: testData.type,
      },
    };

    try {
      await pezzoOpenAI.chat.completions.create(mockRequest, {
        variables: testData.variables,
      });
    } catch (err) {
      //
    }

    const report = await this.reportingService.saveReport(
      promptExecutionData,
      {
        organizationId,
        projectId,
      },
      true
    );

    return report;
  }

  async runGaiPlatformTest(
    testData: TestPromptInput,
    projectId: string,
    organizationId: string
  ): Promise<GetPromptCompletionResult> {
    // const provider = "OpenAI";
    // const providerApiKey = await this.providerApiKeysService.getByProvider(
    //   provider,
    //   organizationId
    // );

    // const testerApiKey =
    //   await this.providerApiKeysService.decryptProviderApiKey(providerApiKey);

    // console.log("api-key: " + testerApiKey);

    // let promptExecutionData;
    let result: GetPromptCompletionResult;

    try {
      const gaiPlatform = new GaiPlatform({});
      result =  await gaiPlatform.getPromptCompletion(
        {
          model: testData.settings.model,
          system_hint: "",
          prompt: testData.content.prompt,
          temperature: testData.settings.temperature,
          max_tokens: testData.settings.max_tokens,
        }
      );
    } catch (err) {
      //
    }

    // console.log("result: " + result)
    // console.log("model: " + result.model);
    // console.log("completion: " + result.completion);
    // console.log("prompt_tokens: " + result.prompt_tokens);
    // console.log("completion_tokens: " + result.completion_tokens);

    // const report = await this.reportingService.saveGaiPlatformReport(
    //   result,
    //   {
    //     organizationId,
    //     projectId,
    //   },
    //   true,
    //   testData.promptId
    // );
    //
    // return report;

    return result
  }
}
