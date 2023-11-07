import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_ORGANIZATIONS } from "~/graphql/definitions/queries/organizations";

export const useOrganizations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => gqlClient.request(GET_ORGANIZATIONS),
  });

  return {
    organizations: data?.organizations,
    isLoading,
  };
};
