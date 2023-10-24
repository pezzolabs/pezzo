import { graphql } from "../../../../@generated/graphql";

export const DELETE_INVITATION = graphql(/* GraphQL */ `
  mutation DeleteInvitation($data: InvitationWhereUniqueInput!) {
    deleteOrgInvitation(data: $data) {
      id
    }
  }
`);

export const ACCEPT_ORG_INVITATION = graphql(/* GraphQL */ `
  mutation AcceptInvitation($data: InvitationWhereUniqueInput!) {
    acceptOrgInvitation(data: $data) {
      id
      name
    }
  }
`);

export const CREATE_ORG_INVITATION = graphql(/* GraphQL */ `
  mutation CreateOrgInvitation($data: CreateOrgInvitationInput!) {
    createOrgInvitation(data: $data) {
      id
    }
  }
`);

export const UPDATE_ORG_INVITATION = graphql(/* GraphQL */ `
  mutation UpdateOrgInvitation($data: UpdateOrgInvitationInput!) {
    updateOrgInvitation(data: $data) {
      id
      role
    }
  }
`);

export const DELETE_ORG_MEMBER = graphql(/* GraphQL */ `
  mutation DeleteOrgMember($data: OrganizationMemberWhereUniqueInput!) {
    deleteOrgMember(data: $data) {
      id
    }
  }
`);

export const UPDATE_ORG_MEMBER_ROLE = graphql(/* GraphQL */ `
  mutation UpdateOrgMemberRole($data: UpdateOrgMemberRoleInput!) {
    updateOrgMemberRole(data: $data) {
      role
    }
  }
`);

export const UPDATE_ORG_SETTINGS = graphql(/* GraphQL */ `
  mutation UpdateOrgSettings($data: UpdateOrgSettingsInput!) {
    updateOrgSettings(data: $data) {
      name
    }
  }
`);
