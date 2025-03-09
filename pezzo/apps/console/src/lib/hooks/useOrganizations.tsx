import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_ORGANIZATIONS } from "src/graphql/definitions/queries/organizations";

export const useOrganizations = () => {
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => gqlClient.request(GET_ORGANIZATIONS),
  });

  return {
    organizations: data?.organizations,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};
