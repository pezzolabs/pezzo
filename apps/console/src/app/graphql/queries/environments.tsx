import { graphql } from "@pezzo/graphql";

export const GET_ALL_ENVIRONMENTS = graphql(/* GraphQL */ `
  query Environments($data: GetEnvironmentsInput!) {
    environments(data: $data) {
      slug
      name
    }
  }
`);

export const GET_ENVIRONMENT = graphql(/* GraphQL */ `
  query Environment($data: GetEnvironmentBySlugInput!) {
    environment(data: $data) {
      slug
      name
    }
  }
`);
