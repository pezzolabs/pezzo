import { Breadcrumb, Layout, Row, Space, theme } from "antd";
import { SideNavigation } from "./SideNavigation";
import styled from "@emotion/styled";
import { Header } from "./Header";
import { useBreadcrumbItems } from "../../lib/hooks/useBreadcrumbItems";

const StyledContent = styled(Layout.Content)`
  padding: 18px;
  max-width: 1280px;
  margin-inline: auto;

  max-height: calc(100vh - 64px);
  overflow-y: auto;

  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  ::-ms-scrollbar {
    display: none; /* IE */
  }
`;

interface Props {
  children: React.ReactNode;
  withSideNav: boolean;
  withHeader?: boolean;
}

export const LayoutWrapper = ({
  children,
  withSideNav,
  withHeader = true,
}: Props) => {
  const breadcrumbItems = useBreadcrumbItems();
  const { token } = theme.useToken();

  return (
    <Layout
      style={{ height: "100vh", maxHeight: "100vh", flexDirection: "column" }}
    >
      {withHeader && <Header />}
      <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
        {withSideNav && <SideNavigation />}
        <StyledContent>
          <Breadcrumb
            items={breadcrumbItems}
            style={{
              marginBottom: token.marginLG,
            }}
          />
          {children}
        </StyledContent>
      </div>
    </Layout>
  );
};
