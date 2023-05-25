import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import {
  GET_ALL_PROVIDER_API_KEYS,
} from "../../graphql/queries/api-keys";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { GET_ME } from "../../graphql/queries/users";
import { GET_ALL_PROJECTS } from "../../graphql/queries/projects";

export const useProviderApiKeys = () => {
  const { project } = useCurrentProject();

  return useQuery({
    queryKey: ["providerApiKeys"],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROVIDER_API_KEYS, {
        data: { projectId: project.id },
      }),
  });
};

export const useGetCurrentUser = () =>
  useQuery({ queryKey: ["me"], queryFn: () => gqlClient.request(GET_ME) });

export const useGetProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: () => gqlClient.request(GET_ALL_PROJECTS),
  });
