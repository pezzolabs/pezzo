import { Breadcrumb, Tabs, Typography, theme } from "antd";
import styled from "@emotion/styled";
import { AppstoreOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { ProjectsPage } from "../projects";

const TabLabel = styled.div`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

const tabsItems = [
  {
    key: "projects",
    label: (
      <TabLabel>
        <AppstoreOutlined /> Projects
      </TabLabel>
    ),
  },
];

export const OrgPage = () => {
  const { orgId: orgIdParam } = useParams();
  const { selectOrg, organization } = useCurrentOrganization();
  const [activeView, setActiveView] = useState("projects");

  useEffect(() => {
    if (orgIdParam) {
      selectOrg(orgIdParam);
    }
  }, [orgIdParam, selectOrg]);

  return (
    organization && (
      <>
        <Typography.Title level={1} style={{ marginTop: 0 }}>
          {organization.name}
        </Typography.Title>

        <Tabs items={tabsItems} />

        <>{activeView === "projects" && <ProjectsPage />}</>
      </>
    )
  );
};
