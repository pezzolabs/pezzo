import { cn } from "@pezzo/ui/utils";
import { useNavigate } from "react-router-dom";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";

const isActive = (href: string) => {
  return window.location.pathname === href;
};

export const OrgSubHeader = () => {
  const navigate = useNavigate();
  const { organization, waitlisted } = useCurrentOrganization();

  if (!organization || waitlisted) {
    return;
  }

  const baseClassName = cn(
    "cursor-pointer py-3 px-3 text-sm font-medium border-b-2 border-b-transparent hover:border-b-primary transition-all"
  );

  const getClassName = (href: string) => {
    return cn(baseClassName, {
      "border-b-2 text-primary border-b-primary": isActive(href),
    });
  };

  const orgNavigation = [
    { name: "Projects", href: `/orgs/${organization.id}` },
    { name: "API Keys", href: `/orgs/${organization.id}/api-keys` },
    { name: "Members", href: `/orgs/${organization.id}/members` },
    { name: "Settings", href: `/orgs/${organization.id}/settings` },
  ];

  return (
    organization && (
      <div className="h-[46px] w-full border-b border-b-border px-8 text-slate-300">
        <ul className="flex">
          {orgNavigation.map((nav) => (
            <li
              key={nav.href}
              onClick={() => navigate(nav.href)}
              className={getClassName(nav.href)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(nav.href);
                }
              }}
              role="button"
              aria-label={nav.name}
            >
              {nav.name}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};
