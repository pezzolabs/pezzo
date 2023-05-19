import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import {
  GET_ALL_PROVIDER_API_KEYS,
  GET_CURRENT_PEZZO_API_KEY,
} from "../../graphql/queries/api-keys";
import { useCurrentProject } from "../providers/CurrentProjectContext";

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
