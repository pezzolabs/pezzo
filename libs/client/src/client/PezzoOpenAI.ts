import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest as OriginalCreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
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

export type PezzoCreateChatCompletionRequest =
  InjectPezzoProps<CreateChatCompletionRequest>;

interface PezzoProps {
  variables?: Record<string, string | number | boolean>;
  properties?: Record<string, string | number | boolean>;
}

export class PezzoOpenAIApi extends OpenAIApi {
  constructor(
    private readonly pezzo: Pezzo,
    ...args: ConstructorParameters<typeof OpenAIApi>
  ) {
    super(...args);
  }

  // @ts-expect-error Overriding the 2nd argument of the OpenAI createChatCompletion API
  override async createChatCompletion(
    _arg1: PezzoCreateChatCompletionRequest | CreateChatCompletionRequest,
    pezzoOptions?: PezzoProps,
    ...rest: Parameters<OpenAIApi["createChatCompletion"]>[1] extends infer P
      ? P[]
      : never[]
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

    if (pezzoOptions?.variables) {
      const messages = interpolateVariablesRecursively<
        ChatCompletionRequestMessage[]
      >(requestBody.messages, pezzoOptions.variables);

      requestBody.messages = messages;
    }

    let result;
    let error;
    let reportPayload: ReportData;

    const baseMetadata: Partial<ObservabilityReportMetadata> = {
      environment: this.pezzo.options.environment,
      provider: Provider.OpenAI,
      type: PromptExecutionType.ChatCompletion,
    };

    const requestTimestamp = new Date().toISOString();

    const baseReport = {
      metadata: merge(baseMetadata, pezzoPrompt?.metadata), // TODO: merge pezzo metadata
      properties: pezzoOptions?.properties,
      request: {
        timestamp: requestTimestamp,
        body: requestBody,
      },
    };

    try {
      result = await super.createChatCompletion.call(
        this,
        ...[requestBody, ...rest.slice(1)]
      );
      const { _request, ...response } = result;

      reportPayload = {
        ...baseReport,
        response: {
          timestamp: new Date().toISOString(),
          body: response.data ?? response.response.data,
          status: response.status ?? response.response.status,
        },
      };
    } catch (err) {
      error = err;

      reportPayload = {
        ...baseReport,
        response: {
          timestamp: new Date().toISOString(),
          body: err.data ?? err.response.data,
          status: err.status ?? err.response.status,
        },
      };
    }

    try {
      await this.pezzo.reportPromptExecution(reportPayload);
    } catch (error) {
      console.error("Failed to report prompt execution", error);
    }

    if (error) {
      throw error;
    }

    return result;
  }
}
