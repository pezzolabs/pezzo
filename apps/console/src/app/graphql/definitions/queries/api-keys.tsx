import { graphql } from "../../../../@generated/graphql";

export const GET_ALL_PROVIDER_API_KEYS = graphql(/* GraphQL */ `
  query ProviderApiKeys($data: GetProviderApiKeysInput!) {
    providerApiKeys(data: $data) {
      id
      provider
      censoredValue
    }
  }
`);

export const GET_ALL_API_KEYS = graphql(/* GraphQL */ `
  query ApiKeys($data: GetApiKeysInput!) {
    apiKeys(data: $data) {
      id
    }
  }
`);
