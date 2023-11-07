import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { SideNavigation } from "./SideNavigation";
import { Header } from "./Header";
import { OrgSubHeader } from "./OrgSubHeader";

interface Props {
  children: React.ReactNode;
  withSideNav?: boolean;
  withOrgSubHeader?: boolean;
}

export const LayoutWrapper = ({
  children,
  withSideNav = false,
  withOrgSubHeader = false,
}: Props) => {
  const location = useLocation();

  return (
    <div className="dark flex h-full max-h-[100vh] w-full text-foreground">
      <div className="flex h-full w-full">
        <div className="h-full max-h-full w-full overflow-y-auto  bg-background">
          <Header />

          {withOrgSubHeader && <OrgSubHeader />}

          <div className="-mt-14 flex h-full pt-14">
            {withSideNav && (
              <div className="h-full max-w-[240px]">
                <SideNavigation />
              </div>
            )}

            <div className="flex-1">
              <div className="no-scrollbar h-full overflow-y-auto pb-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
