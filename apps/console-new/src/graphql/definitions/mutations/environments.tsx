import { graphql } from "../../../../@generated/graphql";

export const CREATE_ENVIRONMENT = graphql(/* GraphQL */ `
  mutation CreateEnvironment($data: CreateEnvironmentInput!) {
    createEnvironment(data: $data) {
      name
    }
  }
`);

export const DELETE_ENVIRONMENT = graphql(/* GraphQL */ `
  mutation DeleteEnvironment($data: EnvironmentWhereUniqueInput!) {
    deleteEnvironment(data: $data) {
      id
    }
  }
`);
