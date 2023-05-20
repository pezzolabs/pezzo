import { Navigate } from "react-router-dom";
import { useGetProjects } from "../../lib/hooks/queries";

export const ProjectsPage = () => {
  const { data, isLoading } = useGetProjects();

  if (data?.projects.length === 0 && !isLoading) {
    return <Navigate to="/onboarding" />;
  }

  return <pre>{JSON.stringify(data)}</pre>;
};
