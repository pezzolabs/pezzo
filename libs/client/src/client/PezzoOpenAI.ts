import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest as OriginalCreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
import {
  InjectPezzoProps
} from "../types";
import { Pezzo } from "./Pezzo";
import { PromptType } from "../@generated/graphql/graphql";
import { ProviderSettingsKeys } from "@pezzo/types";

type CreateChatCompletionRequest = Omit<OriginalCreateChatCompletionRequest, "model" | "messages"> & {
  model?: OriginalCreateChatCompletionRequest["model"];
  messages?: OriginalCreateChatCompletionRequest["messages"];
};

type PezzoCreateChatCompletionRequest = InjectPezzoProps<CreateChatCompletionRequest>;

export class PezzoOpenAIApi extends OpenAIApi {
  constructor(
    private readonly pezzo: Pezzo,
    ...args: ConstructorParameters<typeof OpenAIApi>
  ) {
    super(...args);
  }

  override async createChatCompletion(
    _arg1: PezzoCreateChatCompletionRequest | CreateChatCompletionRequest,
    ...rest: Parameters<OpenAIApi["createChatCompletion"]>[1] extends infer P
      ? P[]
      : never[]
  ) {
    const arg1 = _arg1 as PezzoCreateChatCompletionRequest;

    const pezzoPrompt = arg1.pezzo;
    const nativeOptions = { ...arg1 };
    delete nativeOptions["pezzo"];

    const settings = pezzoPrompt.settings[ProviderSettingsKeys.OPENAI_CHAT_COMPLETION] ?? {};

    let messages: ChatCompletionRequestMessage[] = [];

    if (pezzoPrompt.type === PromptType.Prompt) {
      messages = [
        { role: "user", content: pezzoPrompt.interpolatedContent.prompt },
      ];
    } else if (pezzoPrompt.type === PromptType.Chat) {
      messages = pezzoPrompt.interpolatedContent.messages;
    }

    const requestBody: Partial<CreateChatCompletionRequest> = {
      ...nativeOptions,
      ...settings,
      messages,
    };

    const requestTimestamp = new Date().toISOString();

    let result;
    let error;

    try {
      result = await super.createChatCompletion.call(
        this,
        ...[requestBody, ...rest.slice(1)]
      );
    } catch (err) {
      error = err;
    }
    // const { request, ...response } = result;

    const responseTimestamp = new Date().toISOString();

    const baseMetadata = {
      environment: this.pezzo.options.environment,
    };

    // const reportPayload: ReportData = {
    //   provider: ProviderType.OpenAI,
    //   type: PromptExecutionType.ChatCompletion,
    //   metadata: merge(pezzo?.metadata ?? {}, baseMetadata),
    //   ...(pezzo?.properties && { properties: pezzo.properties }),
    //   request: {
    //     timestamp: requestTimestamp,
    //     body: requestBody,
    //   },
    //   response: {
    //     timestamp: responseTimestamp,
    //     body: response.data ?? response.response.data,
    //     status: response.status ?? response.response.status,
    //   },
    // };

    // try {
    //   await this.pezzo.reportPromptExecutionV2(reportPayload);
    // } catch (error) {
    //   console.error("Failed to report prompt execution", error);
    // }

    if (error) {
      throw error;
    }

    return result;
  }
}
