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
import { version } from "../version";

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
  cache?: boolean;
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
  constructor(private readonly pezzo: Pezzo, private openai: OpenAI) { }

  async create(
    _arg1: PezzoCreateChatCompletionRequest | OpenAIChatCompletionCreateParams,
    pezzoOptions: PezzoProps = {},
    openaiOptions: Parameters<OpenAI["chat"]["completions"]["create"]>[1],
  ): Promise<OpenAI.Chat.ChatCompletion> {
    const arg1 = _arg1 as PezzoCreateChatCompletionRequest;

    const pezzoPrompt = arg1.pezzo as any; // TODO: Fix this type
    const nativeOptions = { ...arg1 };
    delete nativeOptions["pezzo"];

    let managedMessages: OpenAI.Chat.CompletionCreateParams["messages"] = [];

    if (pezzoPrompt) {
      if (pezzoPrompt.content.messages) {
        managedMessages = pezzoPrompt.content.messages;
      } else {
        managedMessages = [
          { role: "user", content: pezzoPrompt.content.prompt },
        ];
      }
    }

    const requestBody: Partial<OpenAI.Chat.CompletionCreateParamsNonStreaming> =
    {
      messages: managedMessages,
      ...(pezzoPrompt?.settings ?? {}),
      ...nativeOptions,
    };

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
      client: "pezzo-ts",
      clientVersion: version,
    };

    const requestTimestamp = new Date().toISOString();

    const baseReport = {
      metadata: merge(baseMetadata, pezzoPrompt?.metadata),
      properties: pezzoOptions?.properties,
      cacheEnabled: false,
      cacheHit: null,
      request: {
        timestamp: requestTimestamp,
        body: requestBody,
      },
    };

    if (pezzoOptions?.cache) {
      baseReport.cacheEnabled = true;

      const cachedRequest = await this.pezzo.fetchCachedRequest(requestBody);

      if (cachedRequest.hit === true) {
        baseReport.cacheHit = true;
        response = {
          ...cachedRequest.data,
          usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
          },
        };

        reportPayload = {
          ...baseReport,
          response: {
            timestamp: requestTimestamp,
            body: response,
            status: 200,
          },
        };
      } else {
        baseReport.cacheHit = false;
      }
    }

    if (!pezzoOptions?.cache || (pezzoOptions?.cache && !baseReport.cacheHit)) {
      try {
        response = await this.openai.chat.completions.create(
          {
            ...(requestBody as OpenAI.Chat.CompletionCreateParamsNonStreaming),
          },
          openaiOptions,
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
    }

    const shouldWriteToCache =
      pezzoOptions?.cache &&
      reportPayload.cacheHit === false &&
      reportPayload.response.status === 200;

    const reportRequest = this.pezzo.reportPromptExecution(reportPayload);

    try {
      await Promise.all(
        shouldWriteToCache
          ? [reportRequest, this.pezzo.cacheRequest(requestBody, response)]
          : [reportRequest]
      );
    } catch (error) {
      console.error("Failed to report prompt execution", error);
    }

    if (error) {
      throw error;
    }

    return response;
  }
}
