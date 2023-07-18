import styled from "@emotion/styled";
import { ProviderProps } from "./types";
import { PromptService, promptProvidersMapping } from "@pezzo/types";

// Logos
import OpenAILogo from "../../../../../assets/providers/openai-logo.svg";
import AzureOpenAILogo from "../../../../../assets/providers/azure-logo.svg";

const Icon = styled.img`
  border-radius: 2px;
  height: 22px;
`;

export const providersList: ProviderProps[] = [
  {
    image: (
      <Icon
        src={OpenAILogo}
        style={{ backgroundColor: "#74AA9C", padding: 2 }}
      />
    ),
    value: PromptService.OpenAIChatCompletion,
    label: promptProvidersMapping[PromptService.OpenAIChatCompletion].name,
  },
  {
    image: <Icon src={AzureOpenAILogo} style={{ padding: 2 }} />,
    value: PromptService.AzureOpenAIChatCompletion,
    label: promptProvidersMapping[PromptService.AzureOpenAIChatCompletion].name,
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
