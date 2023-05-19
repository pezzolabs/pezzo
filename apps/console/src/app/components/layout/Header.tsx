import { Layout, Menu, Space } from "antd";
import styled from "@emotion/styled";
import LogoSquare from "../../../assets/logo.svg";
import { colors } from "../../lib/theme/colors";

const Logo = styled.img`
  height: 40px;
  display: block;
`;

export const Header = () => {
  return (
    <Layout.Header
      style={{
        padding: 20,
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        background: "#141414",
        borderBottom: `1px solid ${colors.neutral["700"]}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Space size="large">
          <Logo src={LogoSquare} alt="Logo" />
        </Space>
      </div>

      <div
        style={{
          display: "flex",
          flex: "100%",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* <ProjectSelector /> */}
      </div>

      <Menu theme="dark" mode="horizontal" />
    </Layout.Header>
  );
};
