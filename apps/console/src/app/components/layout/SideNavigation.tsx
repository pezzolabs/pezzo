import {
  BoltIcon,
  ServerStackIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

import LogoSquare from "../../../assets/logo-square.svg";
import { colors } from "../../lib/theme/colors";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

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
  {
    key: "api-keys",
    label: "API Keys",
    icon: <KeyIcon height={18} />,
  },
];

const bottomMenuItems = [
  {
    key: "info",
    label: "Info",
    icon: <QuestionMarkCircleIcon height={18} />,
  },
  {
    key: "signout",
    label: "Sign Out",
    icon: <ArrowRightOnRectangleIcon height={18} />,
  },
];

const SidebarContainer = styled.div`
  width: 80px;
  background: #141414;
  border-inline-end: 1px solid ${colors.neutral["800"]};
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  width: 36px;
  margin: 20px auto;
  display: block;
`;

const BaseMenu = styled(Menu)`
  border-inline-end: none !important;
`;

const TopMenu = styled(BaseMenu)`
  flex: 100%;
`;

const BottomMenu = styled(BaseMenu)``;

export const SideNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed] = useState(true);

  const handleTopMenuClick = (item) => {
    navigate(`/${item.key}`);
  };

  const handleBottomMenuClick = async (item) => {
    if (item.key === "signout") {
      await signOut();
      window.location.href = "/login";
    }

    if (item.key === "info") {
      navigate("/info");
    }
  };

  return (
    <Layout.Sider collapsed={isCollapsed} style={{ overflow: "hidden" }}>
      <SidebarContainer>
        <Logo src={LogoSquare} alt="Logo" />
        <TopMenu
          onClick={handleTopMenuClick}
          defaultSelectedKeys={["prompts"]}
          selectedKeys={[location.pathname.replace("/", "")]}
          items={topMenuItems}
          mode="inline"
        />
        <BottomMenu
          onClick={handleBottomMenuClick}
          selectedKeys={null}
          items={bottomMenuItems}
          mode="inline"
        />
      </SidebarContainer>
    </Layout.Sider>
  );
};
