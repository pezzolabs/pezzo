import { cn } from "@pezzo/ui/utils";
import { BarChart4, BoxIcon, GitCommitIcon, PencilIcon, SettingsIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";

export const PromptNavigation = ({}) => {
  const { projectId } = useCurrentProject();
  const { prompt } = useCurrentPrompt();
  const navigate = useNavigate();
  const { organization } = useCurrentOrganization();

  if (!organization) {
    return;
  }

  const baseClassName =cn(
    "cursor-pointer h-12 flex gap-2 items-center py-3 px-4 text-sm font-medium border-b-2 border-b-transparent hover:border-b-primary transition-all"
  );

  const getClassName = (item) => {
    return cn(baseClassName, {
      "border-b-2 text-primary border-b-primary": item.isActive(item.href),
    });
  };

  const basePath = `/projects/${projectId}/prompts/${prompt?.id}`

  const orgNavigation = [
    { name: "Editor", icon: PencilIcon, href: `${basePath}/edit`, isActive: (href) => window.location.pathname === href},
    { name: "Versions", icon: GitCommitIcon , href: `${basePath}/versions`, isActive: (href) => window.location.pathname === href},
    { name: "Metrics", icon: BarChart4, href: `${basePath}/metrics`, isActive: (href) => window.location.pathname === href},
  ];

  return (
    organization && (
      <div className="w-full px-8 text-slate-300 border-b border-b-border">
        <ul className="flex">
          <div className="flex items-center pr-8 border-r">
            <BoxIcon className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium font-heading">{prompt?.name}</span>
          </div>
          {orgNavigation.map((nav) => (
            <li
              key={nav.name}
              onClick={() => navigate(nav.href)}
              className={getClassName(nav)}
            >
              <nav.icon className="w-4 h-4"/>
              {nav.name}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};
