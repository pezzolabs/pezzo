import { graphql } from "../../../@generated/graphql";

export const GET_ORGANIZATIONS = graphql(/* GraphQL */ `
  query GetMyOrganizations {
    organizations {
      id
      name
    }
  }
`);

export const GET_ORGANIZATION = graphql(/* GraphQL */ `
  query GetOrganization($data: OrganizationWhereUniqueInput!) {
    organization(data: $data) {
      id
      name
    }
  }
`);
