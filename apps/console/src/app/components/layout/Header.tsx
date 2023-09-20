import {
  Button,
  Col,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  Space,
  Typography,
} from "antd";
import styled from "@emotion/styled";
import LogoSquare from "../../../assets/logo-square.svg";
import { colors } from "../../lib/theme/colors";
import { useAuthContext } from "../../lib/providers/AuthProvider";
import { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "../../lib/utils/sign-out";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../common/Avatar";
import { OrgSelector } from "../organizations/OrgSelector";
import Icon from "@ant-design/icons/lib/components/Icon";

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
          <Icon component={() => <QuestionMarkCircleIcon width={15} />} />
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
          <Icon component={() => <ArrowRightOnRectangleIcon width={15} />} />
        </Col>
      </Row>
    ),
  },
];

export const Header = () => {
  const { currentUser } = useAuthContext();
  const [_, setOpen] = useState(false);
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
        borderBottom: `1px solid ${colors.neutral["800"]}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Space size="small" direction="horizontal" align="center">
          <a href="/">
            <Logo src={LogoSquare} alt="Logo" />
          </a>
        </Space>
      </div>

      <div
        style={{
          marginLeft: 19,
        }}
      >
        <span style={{ visibility: "hidden" }}>Pezzo</span>
      </div>

      <div
        style={{
          display: "flex",
          flex: "100%",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            marginRight: 19,
            borderRight: `1px solid ${colors.neutral["800"]}`,
          }}
        >
          <OrgSelector />
        </div>

        <Dropdown
          arrow={false}
          menu={{
            items: menuItems,
            onClick: async (info) => {
              if (info.key === "signout") {
                await signOut();
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
              </Space>
            </UserProfileButton>
          )}
        </Dropdown>
      </div>
    </Layout.Header>
  );
};
