import { Space, Typography } from "antd";
import { integrations } from "@pezzo/integrations";
import { ProviderApiKeyListItem } from "../../components/api-keys/ProviderApiKeyListItem";
import { PezzoApiKeyListItem } from "../../components/api-keys/PezzoApiKeyListItem";
import { useApiKeys, useProviderApiKeys } from "../../lib/hooks/queries";
import { useCurrentProject } from "../../lib/providers/CurrentProjectContext";

export const APIKeysPage = () => {
  const providers = Object.values(integrations).map((integration) => ({
    name: integration.name,
    iconBase64: integration.iconBase64,
    provider: integration.provider,
  }));

  const { data: apiKeyData } = useApiKeys();
  const { data: providerApiKeysData } = useProviderApiKeys();

  const renderProviderApiKey = (provider) => {
    const apiKey = providerApiKeysData.providerApiKeys.find(
      (key) => key.provider === provider.provider
    );

    return (
      <ProviderApiKeyListItem
        key={provider.provider}
        provider={provider.provider}
        value={apiKey?.value}
        iconBase64={provider.iconBase64}
      />
    );
  };

  return (
    <>
      {apiKeyData && (
        <div style={{ marginBottom: 40 }}>
          <Typography.Title level={1}>Pezzo API Key</Typography.Title>

          <Typography.Paragraph style={{ marginBottom: 20 }}>
            Below you can find your Pezzo API key. This API key is provided to
            the Pezzo client when executing prompts.
          </Typography.Paragraph>

          <Space direction="vertical">
            <PezzoApiKeyListItem value={apiKeyData.currentApiKey.id} />
          </Space>
        </div>
      )}

      {providerApiKeysData && (
        <div>
          <Typography.Title level={1}>Provider API Keys</Typography.Title>

          <Typography.Paragraph style={{ marginBottom: 20 }}>
            In order to be able to test your prompts within the Pezzo Console,
            you must provide an API key for each provider you wish to test. This
            is optional.
          </Typography.Paragraph>

          <Space direction="vertical">
            {providers.map((item, index) => renderProviderApiKey(item))}
          </Space>
        </div>
      )}
    </>
  );
};
