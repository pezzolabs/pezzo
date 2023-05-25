import { graphql } from "@pezzo/graphql";

export const CREATE_ENVIRONMENT = graphql(/* GraphQL */ `
  mutation CreateEnvironment($data: CreateEnvironmentInput!) {
    createEnvironment(data: $data) {
      name
    }
  }
`);
