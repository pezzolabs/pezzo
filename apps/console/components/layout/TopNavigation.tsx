import Image from "next/image";

import Logo from "../../assets/logo.svg";
import { Layout, Menu } from "antd";
const { Header } = Layout;
import { css } from "@emotion/css";

export const TopNavigation = () => {
  return (
    <Header
      className={css`
        background-color: #141414;
        border-bottom: 1px solid rgba(253, 253, 253, 0.12);
      `}
    >
      <div>
        <Image src={Logo} width={110} alt="Logo" />
      </div>
      <Menu mode="horizontal" items={[]} />
    </Header>
  );
};
