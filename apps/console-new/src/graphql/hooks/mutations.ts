import {
  AcceptInvitationMutation,
  CreateOrgInvitationInput,
  CreateOrgInvitationMutation,
  CreateProjectInput,
  CreateProjectMutation,
  CreatePromptVersionInput,
  CreatePromptVersionMutation,
  DeleteEnvironmentMutation,
  DeleteProviderApiKeyMutation,
  DeleteProjectMutation,
  UpdateProjectSettingsMutation,
  DeletePromptMutation,
  EnvironmentWhereUniqueInput,
  InvitationWhereUniqueInput,
  ProjectWhereUniqueInput,
  TestPromptInput,
  TestPromptMutation,
  UpdateOrgInvitationInput,
  UpdateOrgInvitationMutation,
  UpdateOrgMemberRoleInput,
  UpdateOrgMemberRoleMutation,
  UpdateOrgSettingsInput,
  UpdateOrgSettingsMutation,
  UpdateProfileInput,
  UpdateProjectSettingsInput,
  DeleteProviderApiKeyInput,
} from "../../../@generated/graphql/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gqlClient } from "../../lib/graphql";
import { UPDATE_PROFILE } from "../definitions/queries/users";
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT_SETTINGS,
} from "../definitions/mutations/projects";
import {
  ACCEPT_ORG_INVITATION,
  CREATE_ORG_INVITATION,
  DELETE_INVITATION,
  DELETE_ORG_MEMBER,
  UPDATE_ORG_INVITATION,
  UPDATE_ORG_MEMBER_ROLE,
  UPDATE_ORG_SETTINGS,
} from "../definitions/mutations/organizations";
import { GraphQLErrorResponse } from "../types";
import {
  CREATE_PROMPT_VERSION,
  DELETE_PROMPT,
} from "../definitions/mutations/prompts";
import { DELETE_ENVIRONMENT } from "../definitions/mutations/environments";
import { DELETE_PROVIDER_API_KEY } from "../definitions/mutations/api-keys";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { usePromptVersionEditorContext } from "../../lib/providers/PromptVersionEditorContext";
import { TEST_PROMPT } from "../definitions/queries/prompt-executions";

export const useUpdateCurrentUserMutation = () =>
  useMutation({
    mutationFn: ({ name }: UpdateProfileInput) =>
      gqlClient.request(UPDATE_PROFILE, { data: { name } }),
  });

export const useCreateProjectMutation = (props?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateProjectMutation,
    GraphQLErrorResponse,
    CreateProjectInput
  >({
    mutationFn: (data: CreateProjectInput) =>
      gqlClient.request(CREATE_PROJECT, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      props?.onSuccess?.();
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteProjectMutation,
    GraphQLErrorResponse,
    ProjectWhereUniqueInput
  >({
    mutationFn: (data: ProjectWhereUniqueInput) =>
      gqlClient.request(DELETE_PROJECT, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

export const useUpdateProjectSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProjectSettingsMutation,
    GraphQLErrorResponse,
    UpdateProjectSettingsInput
  >({
    mutationFn: (data: UpdateProjectSettingsInput) =>
      gqlClient.request(UPDATE_PROJECT_SETTINGS, {
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

export const useDeleteOrgInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvitationWhereUniqueInput) =>
      gqlClient.request(DELETE_INVITATION, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useAcceptOrgInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AcceptInvitationMutation,
    GraphQLErrorResponse,
    InvitationWhereUniqueInput
  >({
    mutationFn: (data: InvitationWhereUniqueInput) =>
      gqlClient.request(ACCEPT_ORG_INVITATION, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });
};

export const useDeleteOrgMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvitationWhereUniqueInput) =>
      gqlClient.request(DELETE_ORG_MEMBER, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useCreateOrgInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateOrgInvitationMutation,
    GraphQLErrorResponse,
    CreateOrgInvitationInput
  >({
    mutationFn: (data: CreateOrgInvitationInput) =>
      gqlClient.request(CREATE_ORG_INVITATION, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useUpdateOrgInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateOrgInvitationMutation,
    GraphQLErrorResponse,
    UpdateOrgInvitationInput
  >({
    mutationFn: (data: UpdateOrgInvitationInput) =>
      gqlClient.request(UPDATE_ORG_INVITATION, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useDeletePromptMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeletePromptMutation, GraphQLErrorResponse, string>({
    mutationFn: (id: string) =>
      gqlClient.request(DELETE_PROMPT, {
        data: {
          id,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
};

export const useUpdateOrgMemberRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateOrgMemberRoleMutation,
    GraphQLErrorResponse,
    UpdateOrgMemberRoleInput
  >({
    mutationFn: (data: UpdateOrgMemberRoleInput) =>
      gqlClient.request(UPDATE_ORG_MEMBER_ROLE, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useUpdateOrgSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateOrgSettingsMutation,
    GraphQLErrorResponse,
    UpdateOrgSettingsInput
  >({
    mutationFn: (data: UpdateOrgSettingsInput) =>
      gqlClient.request(UPDATE_ORG_SETTINGS, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentOrganization"],
      });
    },
  });
};

export const useDeleteEnvironmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteEnvironmentMutation,
    GraphQLErrorResponse,
    EnvironmentWhereUniqueInput
  >({
    mutationFn: (data: EnvironmentWhereUniqueInput) =>
      gqlClient.request(DELETE_ENVIRONMENT, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["environments"],
      });
    },
  });
};

export const useDeleteProviderApiKeyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteProviderApiKeyMutation,
    GraphQLErrorResponse,
    DeleteProviderApiKeyInput
  >({
    mutationFn: (data: DeleteProviderApiKeyInput) =>
      gqlClient.request(DELETE_PROVIDER_API_KEY, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["providerApiKeys"],
      });
    },
  });
};

export const useCreatePromptVersion = () => {
  const { prompt } = useCurrentPrompt();
  const { setCurrentVersionSha } = usePromptVersionEditorContext();
  const queryClient = useQueryClient();

  return useMutation<
    CreatePromptVersionMutation,
    GraphQLErrorResponse,
    CreatePromptVersionInput
  >({
    mutationFn: (data: CreatePromptVersionInput) => {
      return gqlClient.request(CREATE_PROMPT_VERSION, {
        data: {
          type: data.type,
          service: data.service,
          message: data.message,
          content: data.content,
          settings: data.settings,
          promptId: data.promptId,
        },
      });
    },
    onSuccess: (data) => {
      const { sha } = data.createPromptVersion;
      queryClient.invalidateQueries(["prompt", prompt.id]);
      setCurrentVersionSha(sha);
    },
  });
};

export const useTestPrompt = () => {
  return useMutation<TestPromptMutation, GraphQLErrorResponse, TestPromptInput>(
    {
      mutationFn: (data: TestPromptInput) => {
        return gqlClient.request(TEST_PROMPT, {
          data,
        });
      },
    }
  );
};
