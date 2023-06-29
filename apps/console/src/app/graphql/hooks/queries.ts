import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../../lib/graphql";
import {
  GET_ALL_API_KEYS,
  GET_ALL_PROVIDER_API_KEYS,
} from "../definitions/queries/api-keys";
import { GET_ME } from "../definitions/queries/users";
import { GET_ALL_PROJECTS } from "../definitions/queries/projects";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import { GET_ALL_REQUESTS } from "../definitions/queries/requests";

export const useProviderApiKeys = () => {
  const { organization } = useCurrentOrganization();

  return useQuery({
    queryKey: ["providerApiKeys", organization?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROVIDER_API_KEYS, {
        data: { organizationId: organization?.id },
      }),
  });
};

export const usePezzoApiKeys = () => {
  const { organization } = useCurrentOrganization();

  return useQuery({
    queryKey: ["pezzoApiKeys", organization?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_API_KEYS, {
        data: { organizationId: organization?.id },
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


export const useGetRequestReports = () => {
  const { project } = useCurrentProject();
  const { organization } = useCurrentOrganization();

  return useQuery({
    queryKey: ["requestReports", project?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_REQUESTS, {
        data: { projectId: project?.id, organizationId: organization?.id },
      }),
    enabled: !!project && !!organization,
  });


}
