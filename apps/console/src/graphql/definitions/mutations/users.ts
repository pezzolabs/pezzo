import { graphql } from "~/@generated/graphql";

export const SIGN_UP_USER = graphql(/* GraphQL */ `
  mutation SignupUser($data: SignupUserInput!) {
    signupUser(data: $data) {
      id
      email
      orgMemberships {
        organizationId
      }
    }
  }
`);
