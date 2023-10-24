import { Space, theme, Typography } from "antd";
import { usePezzoApiKeys } from "../../graphql/hooks/queries";
import { PezzoApiKeyListItem } from "../../components/api-keys/PezzoApiKeyListItem";
import { ProviderApiKeysList } from "../../components/api-keys/ProviderApiKeysList";

export const ApiKeysView = () => {
  const { token } = theme.useToken();

  const { data: pezzoApiKeysData } = usePezzoApiKeys();

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

      <div>
        <Typography.Title level={2}>Provider API Keys</Typography.Title>

        <Typography.Paragraph style={{ marginBottom: token.marginMD }}>
          In order to be able to test your prompts within the Pezzo Console, you
          must provide an API key for each provider you wish to test. This is
          optional.
        </Typography.Paragraph>

        <ProviderApiKeysList />
      </div>
    </>
  );
};
