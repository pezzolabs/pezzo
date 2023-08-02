import {
  BoltIcon,
  ChartBarIcon,
  QueueListIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";
import { Menu } from "antd";
import { useMemo } from "react";
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
    key: "requests",
    label: "Requests",
    icon: <QueueListIcon height={18} width={18} />,
  },
  {
    key: "environments",
    label: "Environments",
    icon: <ServerStackIcon height={18} />,
  },
];

const BaseMenu = styled(Menu)`
  border-inline-end: none !important;
  padding: 12px;

  border-right: 1px solid red;
`;
const SidebarContainer = styled.div`
  border-inline-end: 1px solid ${colors.neutral["800"]};
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
        onClick={handleTopMenuClick}
        defaultSelectedKeys={["prompts"]}
        selectedKeys={selectedKeys.length ? selectedKeys : ["prompts"]}
        items={topMenuItems}
      />
    </SidebarContainer>
  );
};
