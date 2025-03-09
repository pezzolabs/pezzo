import { CheckIcon } from "lucide-react";
import { useOrganizations } from "src/lib/hooks/useOrganizations";
import { useGetProjects } from "src/graphql/hooks/queries";
import { useCurrentOrganization } from "src/lib/hooks/useCurrentOrganization";
import { useCurrentProject } from "src/lib/hooks/useCurrentProject";
import { Link } from "react-router-dom";

export const OrgSelector = () => {
  const { organizations } = useOrganizations();
  const { organization: currentOrganization } = useCurrentOrganization();
  const { projects } = useGetProjects();
  const { project: currentProject } = useCurrentProject();

  return (
    <div className="flex text-sm">
      <div className="flex min-w-[200px] flex-col gap-y-2 rounded-r-lg p-2">
        <p className="mt-2 px-2 text-muted-foreground">Organizations</p>
        <ul className="flex h-full flex-col">
          {organizations &&
            currentOrganization &&
            organizations.map((org) => (
              <li>
                <Link
                  to={`/orgs/${org.id}`}
                  className="flex cursor-pointer items-center gap-x-2 rounded-md p-2 transition-all hover:bg-muted"
                >
                  <div className="flex-1">{org.name}</div>
                  {org.id === currentOrganization.id && (
                    <CheckIcon className="h-4 w-4 opacity-50" />
                  )}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="0 flex min-w-[200px] flex-col gap-y-2 rounded-r-lg border-l border-border bg-muted/30 p-2">
        <p className="mt-2 px-2 text-gray-500">Projects</p>
        <ul className="flex h-full flex-col">
          {projects &&
            projects.map((project) => (
              <li className="">
                <Link
                  className="flex cursor-pointer items-center gap-x-2 rounded-md p-2 transition-all hover:bg-muted"
                  to={`/projects/${project.id}`}
                >
                  <div className="flex-1">{project.name}</div>
                  {project.id === currentProject?.id && (
                    <CheckIcon className="h-4 w-4 opacity-50" />
                  )}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
