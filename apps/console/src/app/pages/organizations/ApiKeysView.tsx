import { Space, theme, Typography } from "antd";
import {
  usePezzoApiKeys,
  useProviderApiKeys,
} from "../../graphql/hooks/queries";
import { ProviderApiKeyListItem } from "../../components/api-keys/ProviderApiKeyListItem";
import { PezzoApiKeyListItem } from "../../components/api-keys/PezzoApiKeyListItem";

const providers = [
  {
    name: "OpenAI",
    provider: "OpenAI",
    iconBase64:
      "data:image/png;base64,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",
  },
];

export const ApiKeysView = () => {
  const { token } = theme.useToken();

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
