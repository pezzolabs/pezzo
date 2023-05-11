import { Space, Typography } from "antd";
import { integrations } from "@pezzo/integrations";
import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../../lib/graphql";
import { GET_ALL_PROVIDER_API_KEYS } from "../../graphql/queries/provider-api-keys";
import { APIKeyListItem } from "../../components/api-keys/APIKeyListItem";

export const APIKeysPage = () => {
  const providers = Object.values(integrations).map((integration) => ({
    name: integration.name,
    iconBase64: integration.iconBase64,
    provider: integration.provider,
  }));

  const { data } = useQuery({
    queryKey: ["providerAPIKeys"],
    queryFn: () => gqlClient.request(GET_ALL_PROVIDER_API_KEYS),
  });

  const renderAPIKey = (provider) => {
    const apiKey = data.providerAPIKeys.find(
      (key) => key.provider === provider.provider
    );

    return (
      <APIKeyListItem
        key={provider.provider}
        provider={provider.provider}
        value={apiKey?.value}
        iconBase64={provider.iconBase64}
      />
    );
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <Typography.Title level={1}>Provider API Keys</Typography.Title>

      <Typography.Paragraph style={{ marginBottom: 30 }}>
        In order to be able to test your prompts within the Pezzo Console, you
        must provide an API key for each provider you wish to test. This is
        optional.
      </Typography.Paragraph>

      <Space direction="vertical">
        {providers.map((item, index) => renderAPIKey(item))}
      </Space>
    </>
  );
};
