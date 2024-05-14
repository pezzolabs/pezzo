import {
  BarChart2,
  BoxIcon,
  GraduationCapIcon,
  HardDriveIcon,
  KeyRoundIcon,
  RadioIcon,
} from "lucide-react";
import { cn } from "@pezzo/ui/utils";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";

export const SideNavigation = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { projectId } = useCurrentProject();
  const { organizationId } = useCurrentOrganization();

  const projectNavigation = [
    {
      name: "Prompts",
      href: `/projects/${projectId}`,
      icon: BoxIcon,
      isActive: (href: string) => window.location.pathname.startsWith(href),
    },
    {
      name: "Requests",
      href: `/projects/${projectId}/requests`,
      icon: RadioIcon,
      isActive: (href: string) => window.location.pathname.startsWith(href),
    },
    {
      name: "Dashboard",
      href: `/projects/${projectId}/dashboard`,
      icon: BarChart2,
      isActive: (href: string) => window.location.pathname === href,
    },
    // {
    //   name: "Environments",
    //   href: `/projects/${projectId}/environments`,
    //   icon: HardDriveIcon,
    //   isActive: (href: string) => window.location.pathname.startsWith(href),
    // },
  ];

  return (
    <div
      onMouseOver={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={cn(
        "z-50 flex h-full grow flex-col gap-y-4 overflow-y-auto overflow-x-hidden border-r border-border bg-stone-900 px-3 pt-2"
      )}
    >
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li className="">
            <ul role="list" className={cn("space-y-1")}>
              {projectId &&
                projectNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        item.isActive(item.href)
                          ? "bg-stone-800 text-emerald-500"
                          : "text-stone-400 hover:bg-stone-800 hover:text-white",
                        "flex items-center rounded-md p-2 text-sm font-medium leading-3 transition-all"
                      )}
                    >
                      <item.icon
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />
                      <motion.div
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{
                          width: collapsed ? 0 : 140,
                          opacity: collapsed ? 0 : 1,
                          marginLeft: collapsed ? 0 : 10,
                        }}
                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  </li>
                ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              className="mb-2 mt-auto flex cursor-pointer items-center rounded-md p-2 text-sm font-medium text-stone-400 transition-all hover:bg-stone-800 hover:text-white "
              to={`/orgs/${organizationId}/api-keys`}
            >
              <KeyRoundIcon className="h-5 w-5 shrink-0" aria-hidden="true" />

              <motion.div
                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                animate={{
                  width: collapsed ? 0 : "auto",
                  opacity: collapsed ? 0 : 1,
                  marginLeft: collapsed ? 0 : 10,
                }}
                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                className="whitespace-nowrap"
              >
                API Keys
              </motion.div>
            </Link>
            <Link
              className="mb-2 mt-auto flex cursor-pointer items-center rounded-md p-2 text-sm font-medium text-stone-400 transition-all hover:bg-stone-800 hover:text-white "
              to="https://www.notion.so/User-Manual-d49c811d16ff4f1db415830b3f5a04b2"
              target="_blank"
            >
              <GraduationCapIcon
                className="h-5 w-5 shrink-0"
                aria-hidden="true"
              />

              <motion.div
                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                animate={{
                  width: collapsed ? 0 : "auto",
                  opacity: collapsed ? 0 : 1,
                  marginLeft: collapsed ? 0 : 10,
                }}
                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
              >
                Documenation
              </motion.div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
