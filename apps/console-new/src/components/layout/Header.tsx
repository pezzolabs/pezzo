import { cn } from "@pezzo/ui/utils";
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronsUpDown,
} from "lucide-react";
import LogoSquare from "~/assets/logo-square.svg";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { Popover, PopoverContent, PopoverTrigger } from "@pezzo/ui";
import { useOrganizations } from "~/lib/hooks/useOrganizations";
import { useGetProjects } from "~/graphql/hooks/queries";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { useAuthContext } from "~/lib/providers/AuthProvider";
import { ProjectCopy } from "../projects/ProjectCopy";

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
      <div className="flex min-w-[200px] flex-col gap-y-2 rounded-r-lg border-l border-border 0 p-2 bg-muted/30">
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

export const Header = () => {
  const { organization } = useCurrentOrganization();
  const { project } = useCurrentProject();
  const { currentUser } = useAuthContext();

  return (
    <nav className="flex h-14 items-center gap-x-2 border-b border-b-border">
      <div className={cn("mx-auto ml-2 h-10 w-10")}>
        <img src={LogoSquare} alt="Pezzo" />
      </div>
      <div className="flex flex-1 items-center gap-x-2">
        {organization && (
          <Popover>
            <div className="mx-2 text-lg text-stone-700">{"/"}</div>
            <div className="flex items-center gap-x-2">
              <BriefcaseIcon className="h-4 w-4 text-stone-500" />
              <Link
                to={`/orgs/${organization.id}`}
                className="cursor-pointer text-sm font-medium hover:underline"
              >
                {organization.name}
              </Link>
              <PopoverTrigger className="cursor-pointer" asChild>
                <ChevronsUpDown className="h-4 w-4 text-stone-500" />
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0">
              <OrgSelector />
            </PopoverContent>
          </Popover>
        )}
        {project && (
          <Popover>
            <div className="mx-2 text-lg text-stone-700">{"/"}</div>
            <div className="flex items-center gap-x-2">
              <Link
                to={`/projects/${project.id}`}
                className="cursor-pointer text-sm font-medium hover:underline"
              >
                {project.name}
              </Link>
              <PopoverTrigger className="cursor-pointer" asChild>
                <ChevronsUpDown className="h-4 w-4 text-stone-500" />
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0">
              <OrgSelector />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {project && (
        <div className="text-sm">
          <ProjectCopy />
        </div>
      )}

      {currentUser && <UserMenu />}
    </nav>
  );
};
