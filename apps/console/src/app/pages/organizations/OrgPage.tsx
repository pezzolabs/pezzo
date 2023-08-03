import { Tabs, Typography } from "antd";
import styled from "@emotion/styled";
import {
  AppstoreOutlined,
  KeyOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { ProjectsPage } from "../projects/ProjectsPage";
import { MembersView } from "./MembersView";
import { SettingsView } from "./SettingsView";
import { ApiKeysView } from "./ApiKeysView";
import { useCurrentOrgMembership } from "../../lib/hooks/useCurrentOrgMembership";
import { trackEvent } from "../../lib/utils/analytics";

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
    key: TabItemKey.ApiKeys,
    label: (
      <TabLabel>
        <KeyOutlined /> API Keys
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

  const onTabChange = (key: string) => {
    setActiveView(key);
    trackEvent("organization_tab_changed", { tab: key });
  };

  return organization ? (
    <>
      <Typography.Title level={1} style={{ marginTop: 0 }}>
        {organization.name}
      </Typography.Title>

      <Tabs items={availableTabItems} onChange={onTabChange} />

      {activeView === TabItemKey.Projects && <ProjectsPage />}
      {activeView === TabItemKey.Members && <MembersView />}
      {activeView === TabItemKey.ApiKeys && <ApiKeysView />}
      {activeView === TabItemKey.Settings && isOrgAdmin && <SettingsView />}
    </>
  ) : null;
};
