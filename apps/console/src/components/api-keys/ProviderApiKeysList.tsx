import { ProviderApiKeyListItem } from "./ProviderApiKeyListItem";
import { useProviderApiKeys } from "~/graphql/hooks/queries";
import { providersList } from "./providers-list";

export const ProviderApiKeysList = () => {
  const { providerApiKeys } = useProviderApiKeys();

  const renderProviderApiKey = (provider) => {
    const apiKey = providerApiKeys.find(
      (key) => key.provider === provider.provider
    );

    const value = apiKey?.censoredValue
      ? `**********${apiKey?.censoredValue}`
      : null;

    return (
      <ProviderApiKeyListItem
        key={provider.provider}
        provider={provider.provider}
        value={value}
      />
    );
  };

  return (
    providerApiKeys && (
      <div className="flex max-w-[500px] flex-col gap-4">
        {providersList.map((item) => renderProviderApiKey(item))}
      </div>
    )
  );
};
