import { graphql } from "@pezzo/graphql";

export const UPDATE_PROVIDER_API_KEY = graphql(/* GraphQL */ `
  mutation UpdateProviderAPIKey($data: CreateProviderAPIKeyInput!) {
    updateProviderAPIKey(data: $data) {
      provider
      value
    }
  }
`);
