import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import {
  GET_ALL_PROVIDER_API_KEYS,
  GET_CURRENT_PEZZO_API_KEY,
} from "../../graphql/queries/api-keys";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { GET_ME } from "../../graphql/queries/users";
import { GET_ALL_PROJECTS } from "../../graphql/queries/projects";

export const useApiKeys = () => {
  const { project } = useCurrentProject();
  return useQuery({
    queryKey: ["apiKeys"],
    queryFn: () =>
      gqlClient.request(GET_CURRENT_PEZZO_API_KEY, {
        data: { projectId: project.id },
      }),
  });
};

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
