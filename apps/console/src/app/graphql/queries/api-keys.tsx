import { graphql } from "@pezzo/graphql";

export const GET_ALL_PROVIDER_API_KEYS = graphql(/* GraphQL */ `
  query ProviderApiKeys {
    providerApiKeys {
      id
      provider
      value
    }
  }
`);

export const GET_CURRENT_PEZZO_API_KEY = graphql(/* GraphQL */ `
  query ApiKeys {
    currentApiKey {
      id
    }
  }
`);
