import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { TestPromptInput } from "../prompts/inputs/test-prompt.input";
import {
  Pezzo,
  PezzoCreateChatCompletionRequest,
  PezzoOpenAIApi,
} from "@pezzo/client";
import { Configuration } from "openai";
import { ReportingService } from "../reporting/reporting.service";
import { ConfigService } from "@nestjs/config";
import { RequestReport } from "../reporting/object-types/request-report.model";

@Injectable()
export class PromptTesterService {
  constructor(
    private reportingService: ReportingService,
    private config: ConfigService
  ) {}

  async runTest(
    testData: TestPromptInput,
    projectId: string,
    organizationId: string
  ): Promise<RequestReport> {
    const testerApiKey = this.config.get("TESTER_OPENAI_API_KEY");

    if (!testerApiKey) {
      throw new UnauthorizedException(
        `Missing OpenAI API key for tests (TESTER_OPENAI_API_KEY)`
      );
    }

    let promptExecutionData;

    const mockPezzo = {
      options: {
        environment: "PEZZO_TESTER",
      },
      reportPromptExecution: (data) => (promptExecutionData = data),
    };

    const pezzoOpenAI = new PezzoOpenAIApi(
      mockPezzo as unknown as Pezzo,
      new Configuration({
        apiKey: testerApiKey,
      })
    );

    const mockRequest: PezzoCreateChatCompletionRequest = {
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

    let error;

    try {
      await pezzoOpenAI.createChatCompletion(mockRequest, {
        variables: testData.variables,
      });
    } catch (err) {
      error = err;
    }

    const report = await this.reportingService.saveReport(promptExecutionData, {
      organizationId,
      projectId,
    });

    if (error) {
      throw new BadRequestException(
        "Prompt execution failed, check the Requests page for more information"
      );
    }

    return report;
  }
}
