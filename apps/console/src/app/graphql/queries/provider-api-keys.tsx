import { graphql } from "@pezzo/graphql";

export const GET_ALL_PROVIDER_API_KEYS = graphql(/* GraphQL */ `
  query ProviderAPIKeys {
    providerAPIKeys {
      id
      provider
      value
    }
  }
`);
