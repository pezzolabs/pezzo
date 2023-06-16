import { Space, theme, Typography } from "antd";
import { integrations } from "@pezzo/integrations";
import {
  usePezzoApiKeys,
  useProviderApiKeys,
} from "../../graphql/hooks/queries";
import { ProviderApiKeyListItem } from "../../components/api-keys/ProviderApiKeyListItem";
import { PezzoApiKeyListItem } from "../../components/api-keys/PezzoApiKeyListItem";

export const ApiKeysView = () => {
  const { token } = theme.useToken();
  const providers = Object.values(integrations).map((integration) => ({
    name: integration.name,
    iconBase64: integration.iconBase64,
    provider: integration.provider,
  }));

  const { data: providerApiKeysData } = useProviderApiKeys();
  const { data: pezzoApiKeysData } = usePezzoApiKeys();

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
      {pezzoApiKeysData && (
        <div style={{ marginBottom: token.marginLG }}>
          <Typography.Title level={2}>Pezzo API Key</Typography.Title>
          <Typography.Paragraph style={{ marginBottom: token.marginMD }}>
            Below you can find your Pezzo API key. This API key is provided to
            the Pezzo client when executing prompts.
          </Typography.Paragraph>
          <Space direction="vertical">
            {pezzoApiKeysData.apiKeys.map((item, index) => (
              <PezzoApiKeyListItem key={item.id} value={item.id} />
            ))}
          </Space>
        </div>
      )}

      {providerApiKeysData && (
        <div>
          <Typography.Title level={2}>Provider API Keys</Typography.Title>

          <Typography.Paragraph style={{ marginBottom: token.marginMD }}>
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
