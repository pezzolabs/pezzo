import { Injectable } from "@nestjs/common";
import { TestPromptInput } from "../prompts/inputs/test-prompt.input";
import {GetPromptCompletionResult, Pezzo, PezzoOpenAI} from "@pezzo/client";
import { ReportingService } from "../reporting/reporting.service";
import { ProviderApiKeysService } from "../credentials/provider-api-keys.service";
import { SerializedReport } from "@pezzo/types";
import { GaiPlatform } from "@pezzo/client";
import { PinoLogger } from "../logger/pino-logger";

@Injectable()
export class PromptTesterService {
  constructor(
    private reportingService: ReportingService,
    private providerApiKeysService: ProviderApiKeysService,
    private logger: PinoLogger
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
  ): Promise<SerializedReport> {
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
          system_hint: testData.content.messages[0].content,
          prompt: testData.content.prompt,
          temperature: testData.settings.temperature,
          max_tokens: testData.settings.max_tokens,
          variables: testData.variables,
          extra: testData.content.messages[0].extra
        }
      );
    } catch (err) {
      result = {
        model: testData.settings.model,
        completion: err.toString(),
        prompt_tokens: 0,
        completion_tokens: 0,
        gai_req_id: "0",
        requestTimestamp: new Date(),
        responseTimestamp: new Date(),
        isError: true,
      }
    }

    // this.logger.info("model: " + result.model);
    // this.logger.info("completion: " + result.completion);
    // this.logger.info("prompt_tokens: " + result.prompt_tokens);
    // this.logger.info("completion_tokens: " + result.completion_tokens);

    const report = await this.reportingService.saveGaiPlatformReport(
      result,
      {
        organizationId,
        projectId,
      },
      true,
      {
        promptId: testData.promptId,
        model: testData.settings.model,
        system_hint: testData.content.messages[0].content,
        prompt: testData.content.prompt,
        variables: testData.variables,
        temperature: testData.settings.temperature,
        max_tokens: testData.settings.max_tokens,
        extra: testData.content.messages[0].extra
      }
    );

    return report;
  }
}
