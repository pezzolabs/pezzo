import { BoltIcon, ServerStackIcon } from "@heroicons/react/24/solid";
import { Layout, Menu } from "antd";
import { css } from "@emotion/css";
import { useState } from "react";
import LogoSquare from "../../../assets/logo-square.svg";
import { InfoCircleFilled } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const menuItems = [
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
    key: "info",
    label: "Info",
    icon: <InfoCircleFilled height={18} />,
  },
];

export const SideNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed] = useState(true);

  const handleMenuClick = (item) => {
    navigate(`/${item.key}`);
  };

  return (
    <Sider collapsed={isCollapsed} style={{ overflow: "hidden" }}>
      <div
        className={css`
          width: 80px;
          padding: 20px;
          background: #141414;
          border-inline-end: 1px solid rgba(253, 253, 253, 0.12);
        `}
      >
        <img
          src={LogoSquare}
          width={36}
          style={{ margin: "auto", display: "block" }}
          alt="Logo"
        />
      </div>
      <Menu
        onClick={handleMenuClick}
        className={css`
          padding: 6px;
          height: 100%;
        `}
        defaultSelectedKeys={["prompts"]}
        selectedKeys={[location.pathname.replace("/", "")]}
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
};
