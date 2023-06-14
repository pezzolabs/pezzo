import { Tabs, Typography } from "antd";
import styled from "@emotion/styled";
import {
  AppstoreOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { ProjectsPage } from "../projects";
import { MembersView } from "./MembersView";
import { SettingsView } from "./SettingsView";
import { useCurrentOrgMembership } from "../../lib/hooks/useCurrentOrgMembership";

const TabLabel = styled.div`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

enum TabItemKey {
  Projects = "projects",
  Members = "members",
  ApiKeys = "apiKeys",
  Settings = "settings",
}

const tabsItems = [
  {
    key: TabItemKey.Projects,
    label: (
      <TabLabel>
        <AppstoreOutlined /> Projects
      </TabLabel>
    ),
  },
  {
    key: TabItemKey.Members,
    label: (
      <TabLabel>
        <TeamOutlined /> Members
      </TabLabel>
    ),
  },
  {
    key: TabItemKey.Settings,
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
  const { isOrgAdmin } = useCurrentOrgMembership();
  const [activeView, setActiveView] = useState("projects");

  useEffect(() => {
    if (orgIdParam) {
      selectOrg(orgIdParam);
    }
  }, [orgIdParam, selectOrg]);

  const availableTabItems = useMemo(
    () =>
      tabsItems.filter((tabItem) =>
        tabItem.key === TabItemKey.Settings ? isOrgAdmin : true
      ),
    [tabsItems, isOrgAdmin]
  );

  return (
    organization && (
      <>
        <Typography.Title level={1} style={{ marginTop: 0 }}>
          {organization.name}
        </Typography.Title>

        <Tabs items={availableTabItems} onChange={setActiveView} />

        {activeView === TabItemKey.Projects && <ProjectsPage />}
        {activeView === TabItemKey.Members && <MembersView />}
        {activeView === TabItemKey.Settings && isOrgAdmin && <SettingsView />}
      </>
    )
  );
};
