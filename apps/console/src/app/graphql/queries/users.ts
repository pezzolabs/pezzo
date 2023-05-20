import { graphql } from "@pezzo/graphql";

export const GET_ME = graphql(/* GraphQL */ `
  query GetMe {
    me {
      id
      name
      email
      photoUrl
    }
  }
`);
