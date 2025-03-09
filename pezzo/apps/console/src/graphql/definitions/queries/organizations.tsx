import { graphql } from "~/@generated/graphql";

export const GET_ORGANIZATIONS = graphql(/* GraphQL */ `
  query GetMyOrganizations {
    organizations {
      id
      name
    }
  }
`);

export const GET_ORGANIZATION = graphql(/* GraphQL */ `
  query GetOrg(
    $data: OrganizationWhereUniqueInput!
    $includeInvitations: Boolean = false
    $includeMembers: Boolean = true
  ) {
    organization(data: $data) {
      id
      name
      waitlisted
      members @include(if: $includeMembers) {
        id
        role
        user {
          id
          name
          email
        }
      }
      invitations @include(if: $includeInvitations) {
        id
        email
        role
        invitedBy {
          photoUrl
        }
      }
    }
  }
`);

export const GET_USER_ORG_MEMBERSHIP = graphql(/* GraphQL */ `
  query GetOrgMembership($data: GetUserOrgMembershipInput!) {
    userOrgMembership(data: $data) {
      userId
      role
      organizationId
    }
  }
`);
