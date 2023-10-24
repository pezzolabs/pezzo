import { PromptService } from "../../../../../../@generated/graphql/graphql";
import { azureOpenAIChatCompletionSettingsDefinition } from "./azure-openai-chat-completion";
import { openAIChatCompletionSettingsDefinition } from "./openai-chat-completion";

const defaultSettingsMap = {
  [PromptService.OpenAiChatCompletion]:
    openAIChatCompletionSettingsDefinition.defaultSettings,
  [PromptService.AzureOpenAiChatCompletion]:
    azureOpenAIChatCompletionSettingsDefinition.defaultSettings,
};

export const getServiceDefaultSettings = (service: PromptService) => {
  return defaultSettingsMap[service];
};
