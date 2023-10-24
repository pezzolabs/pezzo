import { graphql } from "../../../../@generated/graphql";

export const UPDATE_PROVIDER_API_KEY = graphql(/* GraphQL */ `
  mutation UpdateProviderAPIKey($data: CreateProviderApiKeyInput!) {
    updateProviderApiKey(data: $data) {
      provider
    }
  }
`);

export const DELETE_PROVIDER_API_KEY = graphql(/* GraphQL */ `
  mutation DeleteProviderAPIKey($data: DeleteProviderApiKeyInput!) {
    deleteProviderApiKey(data: $data) {
      provider
    }
  }
`);
