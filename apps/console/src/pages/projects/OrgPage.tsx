import { ProjectsPage } from "./ProjectsPage";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export const OrgPage = () => {
  const { orgId } = useParams<{ orgId: string }>();

  const [, setCurrentOrgId] = useLocalStorage("currentOrgId", orgId);

  useEffect(() => {
    console.log("orgId", orgId);
    setCurrentOrgId(orgId);
  }, [orgId, setCurrentOrgId]);

  return <ProjectsPage />;
};
