import { ProviderProps } from "./types";
import { promptProvidersMapping } from "@pezzo/types";
import { PromptService } from "~/@generated/graphql/graphql";

// Logos
import OpenAILogo from "~/assets/providers/openai-logo.png";
import AzureOpenAILogo from "~/assets/providers/azure-logo.png";
import AnthropicLogo from "~/assets/providers/anthropic-logo.png";

export const providersList: ProviderProps[] = [
  {
    image: <img alt="OpenAI" src={OpenAILogo} className="w-6 rounded-sm" />,
    value: PromptService.OpenAiChatCompletion,
    label: promptProvidersMapping[PromptService.OpenAiChatCompletion].name,
  },
  {
    image: (
      <img
        alt="Azure OpenAI"
        src={AzureOpenAILogo}
        className="w-6 rounded-sm"
      />
    ),
    value: PromptService.AzureOpenAiChatCompletion,
    label: promptProvidersMapping[PromptService.AzureOpenAiChatCompletion].name,
  },
  {
    image: (
      <img alt="Anthropic" src={AnthropicLogo} className=" w-6 rounded-sm" />
    ),
    value: PromptService.AnthropicCompletion,
    label: promptProvidersMapping[PromptService.AnthropicCompletion].name,
  },
];

/**
 * This function sorts the providers list for correct rendering in the UI.
 * It divides them into two groups - managed and unmanaged.
 * Within those groups, they will be provided in the original order as displayed in the "providersList" array.
 *
 * @param providersKeys Array of provider keys that are managed
 * @returns
 */
export const sortRenderedProviders = (providersKeys: PromptService[]) => {
  const managed = providersList.filter((provider) =>
    providersKeys.includes(provider.value)
  );
  const unmanaged = providersList.filter(
    (provider) => !providersKeys.includes(provider.value)
  );
  const sort = (a, b) => providersList.indexOf(a) - providersList.indexOf(b);
  const sortedManaged = managed.sort(sort);
  const sortedUnmanaged = unmanaged.sort(sort);
  return [...sortedManaged, ...sortedUnmanaged];
};
