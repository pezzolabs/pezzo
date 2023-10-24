import { Breadcrumbs } from "~/components/common/Breadcrumbs";
import { SideNavigation } from "./SideNavigation";
import { useBreadcrumbItems } from "../../lib/hooks/useBreadcrumbItems";
import { ProjectCopy } from "../projects/ProjectCopy";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";

interface Props {
  children: React.ReactNode;
  withSideNav: boolean;
  withHeader?: boolean;
  withBreadcrumbs?: boolean;
}

export const LayoutWrapper = ({
  children,
  withSideNav,
  withHeader = true,
  withBreadcrumbs = true,
}: Props) => {
  const { project } = useCurrentProject();
  const breadcrumbItems = useBreadcrumbItems();
  const location = useLocation();

  return (
    <div className="flex w-full h-full max-h-[100vh]">
      <div className="flex w-full h-full">
        {withSideNav && <SideNavigation />}

        <div className="p-4 overflow-y-auto max-h-full w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              {withBreadcrumbs && breadcrumbItems && <Breadcrumbs items={breadcrumbItems} />}
            </div>
            <div className="col-span-3 flex">{project && <ProjectCopy />}</div>
          </div>

          <motion.div
            key={location.pathname}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
