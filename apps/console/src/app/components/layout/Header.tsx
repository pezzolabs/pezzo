import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Row,
  Space,
  Typography,
} from "antd";
import styled from "@emotion/styled";
import LogoSquare from "../../../assets/logo.svg";
import { colors } from "../../lib/theme/colors";
import { useAuthContext } from "../../lib/providers/AuthProvider";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { signOut } from "supertokens-auth-react/recipe/session";

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

}
`;
const menuItems: MenuProps["items"] = [
  {
    key: "signout",
    label: (
      <Row style={{ width: "100%" }} align="middle">
        <Col>
          <Typography.Text>Sign Out</Typography.Text>
        </Col>
        <Col style={{ marginLeft: "auto" }}>
          <ArrowRightOnRectangleIcon height={14} />
        </Col>
      </Row>
    ),
  },
];

const buildInitials = (name: string) => {
  const splittedName = name.split(" ");
  if (splittedName.length === 1) return splittedName[0][0];
  const [firstName, lastName] = splittedName;
  return `${firstName[0]}${lastName[0]}`;
};

export const Header = () => {
  const { currentUser } = useAuthContext();
  const [open, setOpen] = useState(false);

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
        <Dropdown
          menu={{
            items: menuItems,
            onClick: async (info) => {
              if (info.key === "signout") {
                await signOut();
                window.location.reload();
              }
            },
          }}
          align={{ offset: [0, 12] }}
          trigger={["click"]}
          onOpenChange={setOpen}
        >
          <UserProfileButton ghost style={{ padding: 4, height: "auto" }}>
            <Space size="middle">
              <Avatar
                size="large"
                src={
                  currentUser?.photoUrl ? (
                    <img src={currentUser?.photoUrl} alt="avatar" />
                  ) : undefined
                }
              >
                {buildInitials(currentUser?.name || "")}
              </Avatar>

              <Typography.Text type="secondary">
                {currentUser?.name}
              </Typography.Text>
              <DownOutlined
                style={{ color: colors.neutral[300], width: 12, height: 12 }}
                rotate={open ? 180 : 0}
              />
            </Space>
          </UserProfileButton>
        </Dropdown>
      </div>

      <Menu theme="dark" mode="horizontal" />
    </Layout.Header>
  );
};
