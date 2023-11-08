import { cn } from "@pezzo/ui/utils";
import { BriefcaseIcon, ChevronsUpDown } from "lucide-react";
import LogoSquare from "~/assets/logo-square.svg";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { Popover, PopoverContent, PopoverTrigger } from "@pezzo/ui";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { useAuthContext } from "~/lib/providers/AuthProvider";
import { ProjectCopy } from "../projects/ProjectCopy";
import { OrgSelector } from "./OrgSelector";

export const Header = () => {
  const { organization } = useCurrentOrganization();
  const { project } = useCurrentProject();
  const { currentUser } = useAuthContext();

  return (
    <nav className="flex h-[56px] items-center gap-x-2 border-b border-b-border">
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
