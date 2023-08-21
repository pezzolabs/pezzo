import { Breadcrumb, Col, Layout, Row, theme } from "antd";
import { SideNavigation } from "./SideNavigation";
import styled from "@emotion/styled";
import { Header } from "./Header";
import { useBreadcrumbItems } from "../../lib/hooks/useBreadcrumbItems";
import { ProjectCopy } from "../projects/ProjectCopy";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";

const StyledContent = styled(Layout.Content)`
  padding: 18px;
  margin-inline: 24px;

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
  withBreadcrumbs?: boolean;
}

export const LayoutWrapper = ({
  children,
  withSideNav,
  withHeader = true,
  withBreadcrumbs = true,
}: Props) => {
  const { token } = theme.useToken();
  const { project } = useCurrentProject();
  const breadcrumbItems = useBreadcrumbItems();
  const location = useLocation();

  return (
    <Layout
      style={{
        height: "100vh",
        maxHeight: "100vh",
        flexDirection: "column",
      }}
    >
      {withHeader && <Header />}
      <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
        {withSideNav && <SideNavigation />}

        <StyledContent>
          <Row gutter={[24, 24]}>
            <Col span={18}>
              {withBreadcrumbs && (
                <Breadcrumb
                  items={breadcrumbItems}
                  style={{
                    marginBottom: token.marginLG,
                  }}
                />
              )}
            </Col>
            <Col
              span={6}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              {project && <ProjectCopy />}
            </Col>
          </Row>

          <motion.div
            key={location.pathname}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {children}
          </motion.div>
        </StyledContent>
      </div>
    </Layout>
  );
};
