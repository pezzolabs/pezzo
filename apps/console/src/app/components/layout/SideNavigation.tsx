import {
  ChatBubbleBottomCenterIcon,
  HomeIcon,
  AcademicCapIcon,
  CubeIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "antd";
import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import Icon from "@ant-design/icons/lib/components/Icon";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";

const topMenuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <Icon component={() => <HomeIcon width={15} />} />,
  },
  {
    key: "requests",
    label: "Requests",
    icon: <Icon component={() => <ChatBubbleBottomCenterIcon width={15} />} />,
  },
  {
    key: "prompts",
    label: "Prompts",
    icon: <Icon component={() => <CubeIcon width={15} />} />,
  },
  {
    key: "environments",
    label: "Environments",
    icon: <Icon component={() => <ServerIcon width={15} />} />,
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
        defaultSelectedKeys={["dashboard"]}
        selectedKeys={selectedKeys.length ? selectedKeys : ["dashboard"]}
        items={topMenuItems}
        inlineCollapsed={isCollapsed}
      />
      {/* Bottom Menu */}
      <BaseMenu inlineCollapsed={isCollapsed} mode="inline">
        <Menu.Item
          key="docs"
          icon={<Icon component={() => <AcademicCapIcon width={15} />} />}
        >
          <a href="https://docs.pezzo.ai/" target="_blank" rel="noreferrer">
            <span>Docs</span>
          </a>
        </Menu.Item>
      </BaseMenu>
    </SidebarContainer>
  );
};
