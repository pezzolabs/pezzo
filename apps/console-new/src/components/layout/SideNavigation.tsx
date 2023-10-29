import {
  BarChart2,
  BoxIcon,
  HardDriveIcon,
  RadioIcon,
  SettingsIcon,
} from "lucide-react";
import { cn } from "@pezzo/ui/utils";
import LogoSquare from "~/assets/logo-square.svg";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "~/lib/providers/AuthProvider";
import { SettingsMenu } from "./SettingsMenu";
import { useGetProjects } from "~/graphql/hooks/queries";

export const SideNavigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { projectId, project } = useCurrentProject();
  const { currentUser } = useAuthContext();
  const { projects } = useGetProjects();

  const isActive = (href: string) => {
    return window.location.pathname === href;
  };

  const projectNavigation = [
    { name: "Dashboard", href: `/projects/${projectId}`, icon: BarChart2 },
    {
      name: "Requests",
      href: `/projects/${projectId}/requests`,
      icon: RadioIcon,
    },
    { name: "Prompts", href: `/projects/${projectId}/prompts`, icon: BoxIcon },
    {
      name: "Environments",
      href: `/projects/${projectId}/environments`,
      icon: HardDriveIcon,
    },
  ];

  return (
    <div
      // onMouseOver={() => setCollapsed(false)}
      // onMouseLeave={() => setCollapsed(true)}
      className={cn(
        "flex grow flex-col gap-y-4 overflow-y-auto overflow-x-hidden bg-slate-950 px-3 pt-4"
      )}
    >
      <div className={cn("mx-auto h-10 w-10")}>
        <img src={LogoSquare} alt="Pezzo" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li className="">
            <ul role="list" className={cn("space-y-1")}>
              <li className="p-2 text-xs font-semibold uppercase text-gray-400">
                Project
              </li>

              {projectId &&
                projectNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isActive(item.href)
                          ? "bg-gray-800 text-emerald-500"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
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
          <ul>
            <li className="p-2 text-xs font-semibold uppercase text-gray-400">
              All Projects
            </li>
          </ul>
          {currentUser && <SettingsMenu collapsed={collapsed} />}
        </ul>
      </nav>
    </div>
  );
};
