import {
  Button,
  Col,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import styled from "@emotion/styled";
import LogoSquare from "../../../assets/logo.svg";
import { colors } from "../../lib/theme/colors";
import { useAuthContext } from "../../lib/providers/AuthProvider";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../common/Avatar";
import { OrgSelector } from "../organizations/OrgSelector";

const Logo = styled.img`
  height: 40px;
  display: block;
`;

const UserProfileButton = styled(Button)`
  &:hover {
    border: none;
  }
  border: none;
  outline: none;
`;

const menuItems: MenuProps["items"] = [
  {
    key: "info",
    label: (
      <Row style={{ width: "100%" }} align="middle">
        <Col>
          <Typography.Text>Info</Typography.Text>
        </Col>
        <Col style={{ marginLeft: "auto" }}>
          <QuestionMarkCircleIcon height={16} />
        </Col>
      </Row>
    ),
  },
  {
    key: "signout",
    label: (
      <Row style={{ width: "100%" }} align="middle">
        <Col>
          <Typography.Text>Sign out</Typography.Text>
        </Col>
        <Col style={{ marginLeft: "auto" }}>
          <ArrowRightOnRectangleIcon height={16} />
        </Col>
      </Row>
    ),
  },
];

export const Header = () => {
  const { currentUser } = useAuthContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
        <Space size="small" direction="horizontal" align="center">
          <a href="/">
            <Logo src={LogoSquare} alt="Logo" />
          </a>
          <Tag color={colors.indigo[500]} style={{ fontSize: 10 }}>
            BETA
          </Tag>
        </Space>
      </div>

      <div
        style={{
          marginLeft: 20,
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <OrgSelector />
      </div>

      <div
        style={{
          display: "flex",
          flex: "100%",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Dropdown
          menu={{
            items: menuItems,
            onClick: async (info) => {
              if (info.key === "signout") {
                await signOut();
                window.location.href = "/login";
              }

              if (info.key === "info") {
                navigate(`/info`);
              }
            },
          }}
          align={{ offset: [0, 12] }}
          trigger={["click"]}
          onOpenChange={setOpen}
        >
          {currentUser && (
            <UserProfileButton ghost style={{ padding: 4, height: "auto" }}>
              <Space size="middle">
                <Avatar user={currentUser} size="large" />

                <Typography.Text type="secondary">
                  {currentUser.name}
                </Typography.Text>
                <DownOutlined
                  style={{ color: colors.neutral[300], width: 12, height: 12 }}
                  rotate={open ? 180 : 0}
                />
              </Space>
            </UserProfileButton>
          )}
        </Dropdown>
      </div>
    </Layout.Header>
  );
};
