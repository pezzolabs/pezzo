import { CreateProjectInput, UpdateProfileInput } from "@pezzo/graphql";
import { useMutation } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { UPDATE_PROFILE } from "../../graphql/queries/users";
import { CREATE_PROJECT } from "../../graphql/queries/projects";

export const useUpdateCurrentUserMutation = () =>
  useMutation({
    mutationFn: ({ name }: UpdateProfileInput) =>
      gqlClient.request(UPDATE_PROFILE, { data: { name } }),
  });

export const useCreateProjectMutation = () =>
  useMutation({
    mutationFn: (data: CreateProjectInput) =>
      gqlClient.request(CREATE_PROJECT, { data }),
  });
