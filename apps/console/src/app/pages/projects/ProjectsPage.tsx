import { useNavigate } from "react-router-dom";
import { useGetProjects } from "../../lib/hooks/queries";
import { useEffect } from "react";

export const ProjectsPage = () => {
  const { data, isLoading } = useGetProjects();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!data.projects.length) navigate("/onboarding");
  }, [data, isLoading, navigate]);

  return <pre>{JSON.stringify(data)}</pre>;
};
