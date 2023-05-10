import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_ALL_ENVIRONMENTS } from "../../graphql/queries/environments";

export const useEnvironments = () => {
  const { data } = useQuery({
    queryKey: ["environments"],
    queryFn: () => gqlClient.request(GET_ALL_ENVIRONMENTS),
  });

  return {
    environments: data?.environments,
  };
};
