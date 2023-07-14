import styled from "@emotion/styled";
import { ProviderProps } from "./types";
import { ProviderSettingsKeys } from "@pezzo/types";

// Logos
import OpenAILogo from "../../../../../assets/providers/openai-logo.svg";

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
    value: ProviderSettingsKeys.OPENAI_CHAT_COMPLETION,
    label: "OpenAI Chat Completion",
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
export const sortRenderedProviders = (
  providersKeys: ProviderSettingsKeys[]
) => {
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
