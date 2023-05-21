import { graphql } from "@pezzo/graphql";

export const GET_ALL_PROVIDER_API_KEYS = graphql(/* GraphQL */ `
  query ProviderApiKeys($data: GetProviderApiKeysInput!) {
    providerApiKeys(data: $data) {
      id
      provider
      value
    }
  }
`);

export const GET_CURRENT_PEZZO_API_KEY = graphql(/* GraphQL */ `
  query ApiKeys($data: GetApiKeyInput!) {
    currentApiKey(data: $data) {
      id
    }
  }
`);
