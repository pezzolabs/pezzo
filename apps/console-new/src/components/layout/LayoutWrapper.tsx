import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { SideNavigation } from "./SideNavigation";
import { Header } from "./Header";
import { OrgSubHeader } from "./OrgSubHeader";

interface Props {
  children: React.ReactNode;
  withSideNav: boolean;
  withHeader?: boolean;
  withBreadcrumbs?: boolean;
  withOrgSubHeader?: boolean;
}

export const LayoutWrapper = ({
  children,
  withSideNav,
  withOrgSubHeader = false,
  withHeader = true,
  withBreadcrumbs = true,
}: Props) => {
  const location = useLocation();

  return (
    <div className="flex h-full max-h-[100vh] w-full">
      <div className="flex h-full w-full">
        <div className="h-full max-h-full w-full overflow-y-auto  bg-gray-100/50">
          <Header />

          {withOrgSubHeader && <OrgSubHeader />}

          <div className="-mt-14 flex h-full pt-14">
            {withSideNav && (
              <div className="h-full max-w-[240px]">
                <SideNavigation />
              </div>
            )}

            <div className="flex-1">
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
      </div>
    </div>
  );
};
