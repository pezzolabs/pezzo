import { GetProjectQuery } from "@pezzo/graphql";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProjects } from "../hooks/queries";

interface CurrentProjectContextValue {
  project: GetProjectQuery["project"];
}

const CurrentProjectContext = createContext<CurrentProjectContextValue>({
  project: undefined,
});

export const useCurrentProject = () => useContext(CurrentProjectContext);

export const CurrentProjectProvider = ({ children }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const {
    data: { projects = [] },
    isLoading,
  } = useGetProjects();
  const [project, setProject] = useState<GetProjectQuery["project"]>(null);

  useEffect(() => {
    if (!projectId) {
      return navigate("/projects");
    }

    if (projects && !project) {
      const selectedProject = projects.find((p) => p.id === projectId);
      if (selectedProject) {
        setProject(selectedProject);
      } else {
        return navigate("/projects");
      }
    }
  }, [projectId, projects, project, navigate]);

  if (isLoading || !project) {
    // TODO: loader
    return null;
  }

  const value = {
    project,
  };

  return (
    <CurrentProjectContext.Provider value={value}>
      {children}
    </CurrentProjectContext.Provider>
  );
};
