import { BoltIcon, ServerStackIcon, KeyIcon } from "@heroicons/react/24/solid";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";

import { colors } from "../../lib/theme/colors";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";

const topMenuItems = [
  {
    key: "prompts",
    label: "Prompts",
    icon: <BoltIcon height={18} />,
  },
  {
    key: "environments",
    label: "Environments",
    icon: <ServerStackIcon height={18} />,
  },
];

const SidebarContainer = styled.div`
  background: #141414;
  border-inline-end: 1px solid ${colors.neutral["700"]};
  height: 100%;

  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const BaseMenu = styled(Menu)`
  border-inline-end: none !important;
`;

const TopMenu = styled(BaseMenu)`
  flex: 100%;
`;

const BottomMenu = styled(BaseMenu)``;

export const SideNavigation = () => {
  const { project } = useCurrentProject();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed] = useState(true);

  const handleTopMenuClick = (item) => {
    navigate(`/projects/${project.id}/${item.key}`);
  };

  return (
    <Layout.Sider style={{ overflow: "hidden" }} collapsed={isCollapsed}>
      <SidebarContainer>
        <TopMenu
          onClick={handleTopMenuClick}
          defaultSelectedKeys={["prompts"]}
          selectedKeys={[location.pathname.replace("/", "")]}
          items={topMenuItems}
          mode="inline"
        />
      </SidebarContainer>
    </Layout.Sider>
  );
};
