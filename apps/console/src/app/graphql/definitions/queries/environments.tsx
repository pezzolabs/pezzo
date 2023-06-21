import { graphql } from "../../../../@generated/graphql";

export const GET_ALL_ENVIRONMENTS = graphql(/* GraphQL */ `
  query Environments($data: GetEnvironmentsInput!) {
    environments(data: $data) {
      id
      name
    }
  }
`);
