import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest as OriginalCreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
import { InjectPezzoProps, ReportData } from "../types";
import { Pezzo } from "./Pezzo";
import { PromptType } from "../@generated/graphql/graphql";
import { PromptExecutionType, Provider } from "@pezzo/types";
import { merge } from "../utils/helpers";
import { interpolateVariables } from "../utils";

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
    pezzoProps?: PezzoProps,
    ...rest: Parameters<OpenAIApi["createChatCompletion"]>[1] extends infer P
      ? P[]
      : never[]
  ) {
    const arg1 = _arg1 as PezzoCreateChatCompletionRequest;

    const pezzoPrompt = arg1.pezzo as any; // TODO: Fix this type;
    const nativeOptions = { ...arg1 };
    delete nativeOptions["pezzo"];

    const settings = pezzoPrompt.settings;

    let interpolatedContent: any = {};

    if (pezzoProps?.variables) {
      if (pezzoPrompt.metadata.type === PromptType.Prompt) {
        interpolatedContent = {
          prompt: interpolateVariables(
            pezzoPrompt.content.prompt,
            pezzoProps.variables
          ),
        };
      }
    }

    let messages: ChatCompletionRequestMessage[] = [];

    if (pezzoPrompt.metadata.type === PromptType.Prompt) {
      messages = [{ role: "user", content: interpolatedContent.prompt }];
    } else if (pezzoPrompt.type === PromptType.Chat) {
      // TODO: support chat type in the future
    }

    const requestBody: Partial<CreateChatCompletionRequest> = {
      ...nativeOptions,
      ...settings,
      messages,
    };

    let result;
    let error;
    let reportPayload: ReportData;

    const baseMetadata = {
      environment: this.pezzo.options.environment,
    };

    const requestTimestamp = new Date().toISOString();

    try {
      result = await super.createChatCompletion.call(
        this,
        ...[requestBody, ...rest.slice(1)]
      );
      const { _request, ...response } = result;

      reportPayload = {
        provider: Provider.OpenAI,
        type: PromptExecutionType.ChatCompletion,
        metadata: merge(baseMetadata, pezzoPrompt.metadata), // TODO: merge pezzo metadata
        properties: pezzoProps?.properties,
        request: {
          timestamp: requestTimestamp,
          body: requestBody,
        },
        response: {
          timestamp: new Date().toISOString(),
          body: response.data ?? response.response.data,
          status: response.status ?? response.response.status,
        },
      };
    } catch (err) {
      error = err;

      reportPayload = {
        provider: Provider.OpenAI,
        type: PromptExecutionType.ChatCompletion,
        metadata: merge(baseMetadata, pezzoPrompt.metadata), // TODO: merge pezzo metadata
        properties: pezzoProps?.properties,
        request: {
          timestamp: requestTimestamp,
          body: requestBody,
        },
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
