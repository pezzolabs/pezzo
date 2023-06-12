import { Tabs, Typography } from "antd";
import styled from "@emotion/styled";
import {
  AppstoreOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { ProjectsPage } from "../projects";
import { MembersView } from "./MembersView";
import { SettingsView } from "./SettingsView";

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
  {
    key: "members",
    label: (
      <TabLabel>
        <TeamOutlined /> Members
      </TabLabel>
    ),
  },
  {
    key: "settings",
    label: (
      <TabLabel>
        <SettingOutlined /> Settings
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

        <Tabs items={tabsItems} onChange={setActiveView} />

        {activeView === "projects" && <ProjectsPage />}
        {activeView === "members" && <MembersView />}
        {activeView === "settings" && <SettingsView />}
      </>
    )
  );
};
