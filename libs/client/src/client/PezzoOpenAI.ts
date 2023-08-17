import OpenAI from "openai";
import { Pezzo } from "./Pezzo";
import {
  PezzoCreateChatCompletionRequest,
  ObservabilityReportMetadata,
  ReportData,
} from "../types";
import { interpolateVariablesRecursively } from "../utils";
import { merge } from "../utils/helpers";
import { PromptExecutionType, Provider } from "@pezzo/types";

type OpenAIChatCompletionCreateParams = Omit<
  OpenAI.Chat.CompletionCreateParamsNonStreaming,
  "model" | "messages"
> & {
  model?: OpenAI.Chat.CompletionCreateParams["model"];
  messages?: OpenAI.Chat.CompletionCreateParams["messages"];
};

interface PezzoProps {
  variables?: Record<string, string | number | boolean>;
  properties?: Record<string, string | number | boolean>;
}

export class PezzoOpenAI {
  private openai: OpenAI;
  chat: Chat;

  constructor(
    pezzo: Pezzo,
    configuration?: ConstructorParameters<typeof OpenAI>[0]
  ) {
    this.openai = new OpenAI(configuration);
    this.chat = new Chat(pezzo, this.openai);
  }
}

class Chat {
  completions: Completions;

  constructor(pezzo: Pezzo, openai: OpenAI) {
    this.completions = new Completions(pezzo, openai);
  }
}
class Completions {
  constructor(private readonly pezzo: Pezzo, private openai: OpenAI) {}

  async create(
    _arg1: PezzoCreateChatCompletionRequest | OpenAIChatCompletionCreateParams,
    optionsOrPezzoProps:
      | Parameters<OpenAI["chat"]["completions"]["create"]>[1]
      | PezzoProps = {}
  ) {
    const arg1 = _arg1 as PezzoCreateChatCompletionRequest;

    const pezzoPrompt = arg1.pezzo as any; // TODO: Fix this type
    const nativeOptions = { ...arg1 };
    delete nativeOptions["pezzo"];

    let managedMessages: OpenAI.Chat.CompletionCreateParams["messages"] = [];

    if (pezzoPrompt) {
      managedMessages = [{ role: "user", content: pezzoPrompt.content.prompt }];
    }

    const requestBody: Partial<OpenAI.Chat.CompletionCreateParamsNonStreaming> =
      {
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
        OpenAI.Chat.CompletionCreateParams["messages"]
      >(requestBody.messages, pezzoOptions.variables);
      requestBody.messages = messages;
    }

    let response;
    let error;
    let reportPayload: ReportData;

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

    try {
      response = await this.openai.chat.completions.create(
        {
          ...(requestBody as OpenAI.Chat.CompletionCreateParamsNonStreaming),
        },
        "variables" in optionsOrPezzoProps
          ? undefined
          : (optionsOrPezzoProps as Parameters<
              OpenAI["chat"]["completions"]["create"]
            >[1])
      );

      reportPayload = {
        ...baseReport,
        response: {
          timestamp: new Date().toISOString(),
          body: response,
          status: 200,
        },
      };
    } catch (err) {
      error = err;

      reportPayload = {
        ...baseReport,
        response: {
          timestamp: new Date().toISOString(),
          body: err.error,
          status: err.status,
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

    return response;
  }
}
