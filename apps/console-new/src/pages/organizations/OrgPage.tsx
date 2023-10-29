import { Tabs } from "antd";
import styled from "@emotion/styled";
import {
  AppstoreOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { ProjectsPage } from "../projects/ProjectsPage";
import { useCurrentOrgMembership } from "~/lib/hooks/useCurrentOrgMembership";
import { trackEvent } from "~/lib/utils/analytics";
import { usePageTitle } from "~/lib/hooks/usePageTitle";

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
  usePageTitle(organization?.name);
  const onTabChange = (key: string) => {
    setActiveView(key);
    trackEvent("organization_tab_changed", { tab: key });
  };

  return organization ? (
    <>
      <h1 className="mb-4 text-4xl font-semibold">{organization.name}</h1>

      <Tabs items={availableTabItems} onChange={onTabChange} />

      {activeView === TabItemKey.Projects && <ProjectsPage />}
    </>
  ) : null;
};
