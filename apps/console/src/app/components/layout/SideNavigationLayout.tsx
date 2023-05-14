import { Layout } from "antd";
import { SideNavigation } from "./SideNavigation";
import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

const StyledContent = styled(Layout.Content)`
  padding: 22px;
  min-height: 200px;
  overflow-y: auto;

  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  ::-ms-scrollbar {
    display: none; /* IE */
  }
`;

export const SideNavigationLayout = () => (
  <Layout style={{ height: "100vh", maxHeight: "100vh" }}>
    <SideNavigation />
    <StyledContent>
      <Outlet />
    </StyledContent>
  </Layout>
);
