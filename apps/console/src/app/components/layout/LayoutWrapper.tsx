import { Layout } from "antd";
import { SideNavigation } from "./SideNavigation";
import styled from "@emotion/styled";
import { Header } from "./Header";

const StyledContent = styled(Layout.Content)`
  padding: 18px;
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
}

export const LayoutWrapper = ({ children, withSideNav }: Props) => (
  <Layout
    style={{ height: "100vh", maxHeight: "100vh", flexDirection: "column" }}
  >
    <Header />
    <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
      {withSideNav && <SideNavigation />}
      <StyledContent>{children}</StyledContent>
    </div>
  </Layout>
);
