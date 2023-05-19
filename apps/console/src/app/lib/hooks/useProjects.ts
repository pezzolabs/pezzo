import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_ALL_PROJECTS } from "../../graphql/queries/projects";

export const useProjects = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => gqlClient.request(GET_ALL_PROJECTS),
  });

  return {
    projects: data?.projects,
    isLoading,
  };
};
