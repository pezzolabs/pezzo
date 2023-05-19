import { GetProjectQuery } from "@pezzo/graphql";
import { createContext, useContext, useEffect, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useNavigate, useParams } from "react-router-dom";

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
  const { projects, isLoading } = useProjects();
  const [project, setProject] = useState<GetProjectQuery["project"]>(null);

  useEffect(() => {
    if (!projectId) {
      console.log("navigrating");
      return navigate("/projects");
    }

    if (projects && !project) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setProject(project);
      } else {
        return navigate("/projects");
      }
    }
  }, [projectId, projects]);

  if (isLoading || !project) {
    // TODO: loader
    return null;
  }

  console.log("projectId", projectId);
  console.log("projects", projects);
  console.log("project", project);

  const value = {
    project,
  };

  return (
    <CurrentProjectContext.Provider value={value}>
      {children}
    </CurrentProjectContext.Provider>
  );
};
