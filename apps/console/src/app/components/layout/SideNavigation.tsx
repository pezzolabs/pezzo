import { ChatBubbleBottomCenterIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Menu } from "antd";
import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";

import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import {
  AcademicCapIcon,
  CubeIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";

const topMenuItems = [
  {
    key: "overview",
    label: "Overview",
    icon: <HomeIcon height={18} />,
  },
  {
    key: "prompts",
    label: "Prompts",
    icon: <CubeIcon height={18} />,
  },
  {
    key: "requests",
    label: "Requests",
    icon: <ChatBubbleBottomCenterIcon height={18} width={18} />,
  },
  {
    key: "environments",
    label: "Environments",
    icon: <ServerIcon height={18} />,
  },
];

const BaseMenu = styled(Menu)`
  border-inline-end: none !important;
  padding: 12px;

  border-right: 1px solid red;
`;
const SidebarContainer = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopMenu = styled(BaseMenu)`
  flex: 100%;
`;

export const SideNavigation = () => {
  const { project } = useCurrentProject();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed] = useState(true);

  const handleTopMenuClick = (item) => {
    navigate(`/projects/${project.id}/${item.key}`);
  };

  const paths = location.pathname.replace("/", "")?.split("/");

  const selectedKeys = useMemo(
    () =>
      paths?.map((path) => {
        const item = topMenuItems.find((item) => item.key === path);
        return item?.key;
      }),
    [paths]
  ).filter(Boolean);

  return (
    <SidebarContainer>
      <TopMenu
        mode="inline"
        onClick={handleTopMenuClick}
        defaultSelectedKeys={["prompts"]}
        selectedKeys={selectedKeys.length ? selectedKeys : ["prompts"]}
        items={topMenuItems}
        inlineCollapsed={isCollapsed}
      />
      {/* Bottom Menu */}
      <BaseMenu inlineCollapsed={isCollapsed} mode="inline">
        <Menu.Item key="docs" icon={<AcademicCapIcon height={18} />}>
          <a href="https://docs.pezzo.ai/" target="_blank" rel="noreferrer">
            <span>Docs</span>
          </a>
        </Menu.Item>
      </BaseMenu>
    </SidebarContainer>
  );
};
