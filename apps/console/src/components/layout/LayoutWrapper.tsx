import { SideNavigation } from "./SideNavigation";
import { Header } from "./Header";
import { OrgSubHeader } from "./OrgSubHeader";
import { cn } from "@pezzo/ui/utils";

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
  return (
    <div className="dark flex h-full max-h-[100vh] w-full text-foreground">
      <div className="flex h-full w-full">
        <div className="flex h-full max-h-full w-full flex-col overflow-y-auto bg-background">
          {/* Top */}
          <div>
            <Header />
            {withOrgSubHeader && <OrgSubHeader />}
          </div>

          {/* Bottom */}
          <div className={cn("flex h-full max-h-[calc(100%-58px)] flex-1")}>
            {withSideNav && (
              <div className="h-full max-w-[240px]">
                <SideNavigation />
              </div>
            )}

            <div className={cn("no-scrollbar flex-1 overflow-y-auto pb-4")}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
