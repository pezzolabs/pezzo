import { graphql } from "~/@generated/graphql";

export const GET_ME = graphql(/* GraphQL */ `
  query GetMe {
    me {
      id
      email
      photoUrl
      name
      organizationIds
    }
  }
`);

export const GET_USER = graphql(/* GraphQL */ `
  query GetUser($data: String!) {
    getUser(data: $data) {
      id
      email
      photoUrl
      name
    }
  }
`);

export const UPDATE_PROFILE = graphql(/* GraphQL */ `
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      name
    }
  }
`);
