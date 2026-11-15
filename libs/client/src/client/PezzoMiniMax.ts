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

const MINIMAX_API_BASE = "https://api.minimax.io/v1";

interface MiniMaxChatCompletionCreateParams {
  model: string;
  messages: OpenAI.Chat.CompletionCreateParams["messages"];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  [key: string]: unknown;
}

interface PezzoProps {
  variables?: Record<string, string | number | boolean>;
  properties?: Record<string, string | number | boolean>;
  cache?: boolean;
}

export class PezzoMiniMax {
  private openai: OpenAI;
  chat: MiniMaxChat;

  constructor(
    pezzo: Pezzo,
    options?: { apiKey?: string }
  ) {
    // MiniMax uses OpenAI-compatible API
    this.openai = new OpenAI({
      apiKey: options?.apiKey ?? process.env.MINIMAX_API_KEY,
      baseURL: MINIMAX_API_BASE,
    });
    this.chat = new MiniMaxChat(pezzo, this.openai);
  }
}

class MiniMaxChat {
  completions: MiniMaxCompletions;

  constructor(pezzo: Pezzo, openai: OpenAI) {
    this.completions = new MiniMaxCompletions(pezzo, openai);
  }
}

class MiniMaxCompletions {
  constructor(private readonly pezzo: Pezzo, private openai: OpenAI) {}

  async create(
    _arg1: PezzoCreateChatCompletionRequest | MiniMaxChatCompletionCreateParams,
    pezzoOptions: PezzoProps = {}
  ): Promise<OpenAI.Chat.ChatCompletion> {
    const arg1 = _arg1 as PezzoCreateChatCompletionRequest;

    const pezzoPrompt = arg1.pezzo as any;
    const nativeOptions = { ...arg1 } as any;
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

    const requestBody: Partial<MiniMaxChatCompletionCreateParams> = {
      messages: managedMessages,
      ...(pezzoPrompt?.settings ?? {}),
      ...nativeOptions,
    };

    // Clamp temperature for MiniMax (must be in (0.0, 1.0])
    if (requestBody.temperature !== undefined) {
      requestBody.temperature = Math.max(
        0.01,
        Math.min(1, requestBody.temperature)
      );
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
      provider: Provider.MiniMax,
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
        response = await this.openai.chat.completions.create({
          ...(requestBody as OpenAI.Chat.CompletionCreateParamsNonStreaming),
        });

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
