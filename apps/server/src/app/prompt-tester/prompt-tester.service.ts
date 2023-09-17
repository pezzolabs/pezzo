import { Injectable } from "@nestjs/common";
import { TestPromptInput } from "../prompts/inputs/test-prompt.input";
import { Pezzo, PezzoOpenAI } from "@pezzo/client";
import { ReportingService } from "../reporting/reporting.service";
import { RequestReport } from "../reporting/object-types/request-report.model";
import { ProviderApiKeysService } from "../credentials/provider-api-keys.service";

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
  ): Promise<RequestReport> {
    const provider = "OpenAI";
    const providerApiKey = await this.providerApiKeysService.getByProvider(
      provider,
      organizationId
    );

    const testerApiKey =
      await this.providerApiKeysService.decryptProviderApiKey(providerApiKey);

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
      },
    };

    try {
      await pezzoOpenAI.chat.completions.create(mockRequest, {
        variables: testData.variables,
      });
    } catch (err) {
      //
    }

    const report = await this.reportingService.saveReport(promptExecutionData, {
      organizationId,
      projectId,
    });

    return report;
  }
}
