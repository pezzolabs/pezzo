import {
  CreateProjectInput,
  CreateProjectMutation,
  UpdateProfileInput,
} from "../../../@generated/graphql/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { UPDATE_PROFILE } from "../../graphql/queries/users";
import { CREATE_PROJECT } from "../../graphql/queries/projects";
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
