import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest as OriginalCreateChatCompletionRequest,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import {
  InjectPezzoProps,
  ObservabilityReportMetadata,
  ReportData,
} from "../types";
import { Pezzo } from "./Pezzo";
import { PromptExecutionType, Provider } from "@pezzo/types";
import { merge } from "../utils/helpers";
import { interpolateVariablesRecursively } from "../utils";

type CreateChatCompletionRequest = Omit<
  OriginalCreateChatCompletionRequest,
  "model" | "messages"
> & {
  model?: OriginalCreateChatCompletionRequest["model"];
  messages?: OriginalCreateChatCompletionRequest["messages"];
};

type PezzoCreateChatCompletionRequest =
  InjectPezzoProps<CreateChatCompletionRequest>;

interface PezzoProps {
  variables?: Record<string, string | number | boolean>;
  properties?: Record<string, string | number | boolean>;
}

export class PezzoOpenAIApiEdge extends OpenAIApi {
  constructor(private readonly pezzo: Pezzo, configuration: Configuration) {
    super(configuration);
  }
  override async createChatCompletion(
    _arg1: PezzoCreateChatCompletionRequest | CreateChatCompletionRequest,
    optionsOrPezzoProps:
      | Parameters<OpenAIApi["createChatCompletion"]>[1]
      | PezzoProps = {}
  ) {
    const arg1 = _arg1 as PezzoCreateChatCompletionRequest;

    const pezzoPrompt = arg1.pezzo as any; // TODO: Fix this type;
    const nativeOptions = { ...arg1 };
    delete nativeOptions["pezzo"];

    let managedMessages: ChatCompletionRequestMessage[] = [];

    if (pezzoPrompt) {
      managedMessages = [{ role: "user", content: pezzoPrompt.content.prompt }];
    }

    const requestBody: Partial<CreateChatCompletionRequest> = {
      messages: managedMessages,
      ...(pezzoPrompt?.settings ?? {}),
      ...nativeOptions,
    };

    let pezzoOptions: PezzoProps | undefined;

    if (
      "variables" in optionsOrPezzoProps ||
      "properties" in optionsOrPezzoProps
    ) {
      pezzoOptions = optionsOrPezzoProps as PezzoProps;
    }

    if (pezzoOptions?.variables) {
      const messages = interpolateVariablesRecursively<
        ChatCompletionRequestMessage[]
      >(requestBody.messages, pezzoOptions.variables);

      requestBody.messages = messages;
    }

    const baseMetadata: Partial<ObservabilityReportMetadata> = {
      environment: this.pezzo.options.environment,
      provider: Provider.OpenAI,
      type: PromptExecutionType.ChatCompletion,
    };

    const requestTimestamp = new Date().toISOString();

    const baseReport = {
      metadata: merge(baseMetadata, pezzoPrompt?.metadata),
      properties: pezzoOptions?.properties,
      request: {
        timestamp: requestTimestamp,
        body: requestBody,
      },
    };

    let reportPayload: ReportData;
    const result = await super.createChatCompletion(
      {
        ...(requestBody as OriginalCreateChatCompletionRequest),
      },
      "variables" in optionsOrPezzoProps
        ? undefined
        : (optionsOrPezzoProps as Parameters<
            OpenAIApi["createChatCompletion"]
          >[1])
    );
    if (requestBody.stream) return result;

    const data = await result.json();

    if (!result.ok) {
      reportPayload = {
        ...baseReport,
        response: {
          timestamp: new Date().toISOString(),
          body: data,
          status: result.status,
        },
      };
    } else {
      reportPayload = {
        ...baseReport,
        response: {
          timestamp: new Date().toISOString(),
          body: data,
          status: result.status,
        },
      };
    }

    try {
      await this.pezzo.reportPromptExecution(reportPayload);
    } catch (error) {
      console.error("Failed to report prompt execution", error);
    }

    return result;
  }
}
