import {
  AcceptInvitationMutation,
  CreateOrgInvitationInput,
  CreateOrgInvitationMutation,
  CreateProjectInput,
  CreateProjectMutation,
  InvitationWhereUniqueInput,
  UpdateOrgInvitationInput,
  UpdateOrgInvitationMutation,
  UpdateOrgMemberRoleInput,
  UpdateOrgMemberRoleMutation,
  UpdateOrgSettingsInput,
  UpdateOrgSettingsMutation,
  UpdateProfileInput,
} from "../../../@generated/graphql/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { UPDATE_PROFILE } from "../../graphql/queries/users";
import { CREATE_PROJECT } from "../../graphql/queries/projects";
import {
  ACCEPT_ORG_INVITATION,
  CREATE_ORG_INVITATION,
  DELETE_INVITATION,
  DELETE_ORG_MEMBER,
  UPDATE_ORG_INVITATION,
  UPDATE_ORG_MEMBER_ROLE,
  UPDATE_ORG_SETTINGS,
} from "../../graphql/mutations/organizations";
import { GraphQLErrorResponse } from "../../graphql/types";

export const useUpdateCurrentUserMutation = () =>
  useMutation({
    mutationFn: ({ name }: UpdateProfileInput) =>
      gqlClient.request(UPDATE_PROFILE, { data: { name } }),
  });

export const useCreateProjectMutation = (props?: {
  onSuccess?: () => void;
}) => {
  const queryCache = useQueryClient();

  return useMutation<
    CreateProjectMutation,
    GraphQLErrorResponse,
    CreateProjectInput
  >({
    mutationFn: (data: CreateProjectInput) =>
      gqlClient.request(CREATE_PROJECT, { data }),
    onSuccess: () => {
      queryCache.invalidateQueries({
        queryKey: ["projects"],
      });
      props?.onSuccess?.();
    },
  });
};

export const useDeleteOrgInvitation = () => {
  const queryCache = useQueryClient();

  return useMutation({
    mutationFn: (data: InvitationWhereUniqueInput) =>
      gqlClient.request(DELETE_INVITATION, { data }),
    onSuccess: () => {
      queryCache.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useAcceptOrgInvitation = () => {
  const queryCache = useQueryClient();

  return useMutation<
    AcceptInvitationMutation,
    GraphQLErrorResponse,
    InvitationWhereUniqueInput
  >({
    mutationFn: (data: InvitationWhereUniqueInput) =>
      gqlClient.request(ACCEPT_ORG_INVITATION, { data }),
    onSuccess: () => {
      queryCache.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });
};

export const useDeleteOrgMember = () => {
  const queryCache = useQueryClient();

  return useMutation({
    mutationFn: (data: InvitationWhereUniqueInput) =>
      gqlClient.request(DELETE_ORG_MEMBER, { data }),
    onSuccess: () => {
      queryCache.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useCreateOrgInvitationMutation = () => {
  const queryCache = useQueryClient();

  return useMutation<
    CreateOrgInvitationMutation,
    GraphQLErrorResponse,
    CreateOrgInvitationInput
  >({
    mutationFn: (data: CreateOrgInvitationInput) =>
      gqlClient.request(CREATE_ORG_INVITATION, { data }),
    onSuccess: () => {
      queryCache.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useUpdateOrgInvitationMutation = () => {
  const queryCache = useQueryClient();

  return useMutation<
    UpdateOrgInvitationMutation,
    GraphQLErrorResponse,
    UpdateOrgInvitationInput
  >({
    mutationFn: (data: UpdateOrgInvitationInput) =>
      gqlClient.request(UPDATE_ORG_INVITATION, { data }),
    onSuccess: () => {
      queryCache.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useUpdateOrgMemberRoleMutation = () => {
  const queryCache = useQueryClient();

  return useMutation<
    UpdateOrgMemberRoleMutation,
    GraphQLErrorResponse,
    UpdateOrgMemberRoleInput
  >({
    mutationFn: (data: UpdateOrgMemberRoleInput) =>
      gqlClient.request(UPDATE_ORG_MEMBER_ROLE, { data }),
    onSuccess: () => {
      queryCache.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useUpdateOrgSettingsMutation = () => {
  const queryCache = useQueryClient();

  return useMutation<
    UpdateOrgSettingsMutation,
    GraphQLErrorResponse,
    UpdateOrgSettingsInput
  >({
    mutationFn: (data: UpdateOrgSettingsInput) =>
      gqlClient.request(UPDATE_ORG_SETTINGS, { data }),
    onSuccess: () => {
      queryCache.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};
