import { graphql } from "@pezzo/graphql";

export const CREATE_ENVIRONMENT = graphql(/* GraphQL */ `
  mutation CreateEnvironment($data: EnvironmentCreateInput!) {
    createEnvironment(data: $data) {
      slug
      name
    }
  }
`);