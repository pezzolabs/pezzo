import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import {
  GET_ALL_API_KEYS,
  GET_ALL_PROVIDER_API_KEYS,
} from "../../graphql/queries/api-keys";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { GET_ME } from "../../graphql/queries/users";
import { GET_ALL_PROJECTS } from "../../graphql/queries/projects";
import { useCurrentOrganization } from "./useCurrentOrganization";

export const useProviderApiKeys = () => {
  const { organization } = useCurrentOrganization();

  return useQuery({
    queryKey: ["providerApiKeys", organization.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROVIDER_API_KEYS, {
        data: { organizationId: organization.id },
      }),
  });
};

export const usePezzoApiKeys = () => {
  const { organization } = useCurrentOrganization();

  return useQuery({
    queryKey: ["pezzoApiKeys", organization.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_API_KEYS, {
        data: { organizationId: organization.id },
      }),
  });
};

export const useGetCurrentUser = () =>
  useQuery({ queryKey: ["me"], queryFn: () => gqlClient.request(GET_ME) });

export const useGetProjects = () => {
  const { organization } = useCurrentOrganization();

  const { data, isLoading } = useQuery({
    queryKey: ["projects", organization?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROJECTS, {
        data: { organizationId: organization?.id },
      }),
    enabled: !!organization,
  });

  return {
    projects: data?.projects,
    isLoading,
  };
};
