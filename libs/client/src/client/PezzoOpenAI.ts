import { OpenAIApi } from "openai";
import { extractPezzoFromArgs } from "../utils/helpers";
import {
  PezzoArgExtension,
  PezzoExtendedArgs,
  PromptExecutionType,
  ProviderType,
  ReportData,
} from "../types";
import { Pezzo } from "./Pezzo";

export type CreatePezzoChatCompletionRequest = PezzoArgExtension<
  Parameters<OpenAIApi["createChatCompletion"]>
>;

export class PezzoOpenAIApi extends OpenAIApi {
  constructor(
    private readonly pezzo: Pezzo,
    ...args: ConstructorParameters<typeof OpenAIApi>
  ) {
    super(...args);
  }

  override async createChatCompletion(
    ...args: PezzoExtendedArgs<Parameters<OpenAIApi["createChatCompletion"]>>
  ) {
    const { pezzo, originalArgs } = extractPezzoFromArgs(args);
    const requestBody = originalArgs[0];

    const requestTimestamp = new Date().toISOString();

    let createChatCompletionResult;
    try {
      createChatCompletionResult = await super.createChatCompletion.call(
        this,
        ...originalArgs,
      );
    } catch (error) {
      createChatCompletionResult = error;
    }
    const { request, ...response } = createChatCompletionResult;

    const responseTimestamp = new Date().toISOString();


    const reportPayload: ReportData = {
      provider: ProviderType.OpenAI,
      type: PromptExecutionType.ChatCompletion,
      metadata: pezzo.metadata,
      request: {
        timestamp: requestTimestamp,
        body: requestBody,
      },
      response: {
        timestamp: responseTimestamp,
        body: response.data ?? response.response.data,
        status: response.status ?? response.response.status,
      },
    };

    try {
      await this.pezzo.reportPromptExecutionV2(reportPayload);
    } catch (error) {
      console.error("Failed to report prompt execution", error);
    }

    return createChatCompletionResult;
  }
}
