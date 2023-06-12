import {
  Button,
  Col,
  List,
  Row,
  Space,
  Typography,
  Card,
  message,
  Modal,
} from "antd";
import { GetOrgQuery } from "../../../@generated/graphql/graphql";
import { DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import { OrgRoleSelector } from "./OrgRoleSelector";
import colors from "tailwindcss/colors";
import { useCopyToClipboard } from "usehooks-ts";
import { useState } from "react";
import { useDeleteOrgInvitation } from "../../lib/hooks/mutations";
import { useCurrentOrgMembership } from "../../lib/hooks/useCurrentOrgMembership";

type Invitation = GetOrgQuery["organization"]["invitations"][0];

interface Props {
  invitations: Invitation[];
}

export const OrgInvitationsList = ({ invitations }: Props) => {
  const { isOrgAdmin } = useCurrentOrgMembership();
  const { mutateAsync: deleteOrgInvitation } = useDeleteOrgInvitation();
  const [messageApi, contextHolder] = message.useMessage();
  const [deletingInvitation, setDeletingInvitation] =
    useState<Invitation>(null);
  const [, copy] = useCopyToClipboard();

  const handleCopyInvitation = (invitation: Invitation) => {
    const url = new URL(window.location.origin);
    url.pathname = `/invitations/accept`;
    url.searchParams.set("token", invitation.id);

    copy(url.toString());
    messageApi.open({
      type: "info",
      content: "Invitation link copied to clipboard",
    });
  };

  const handleDeleteInvitation = async (invitation: Invitation) => {
    messageApi.open({
      type: "success",
      content: "Invitation deleted",
    });
    await deleteOrgInvitation({ id: invitation.id });
    setDeletingInvitation(null);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Are you sure?"
        open={!!deletingInvitation}
        okType="danger"
        okText="Delete"
        onOk={() => handleDeleteInvitation(deletingInvitation)}
        onCancel={() => setDeletingInvitation(null)}
      >
        <p>Are you sure you want to delete the invitation?</p>
      </Modal>
      <List
        itemLayout="horizontal"
        dataSource={invitations}
        renderItem={(invitation) => (
          <List.Item>
            <Card style={{ width: "100%" }} size="small">
              <Row align="middle" style={{ width: "100%" }}>
                <Col flex="1">
                  <Typography.Text>{invitation.email}</Typography.Text>
                </Col>
                <Space size="large">
                  <Col>
                    <Button
                      onClick={() => handleCopyInvitation(invitation)}
                      style={{ color: colors["neutral"]["400"] }}
                      type="text"
                      icon={<LinkOutlined />}
                    >
                      Copy Link
                    </Button>
                  </Col>
                  <Col>
                    <Typography.Text type="secondary">Role: </Typography.Text>
                    <OrgRoleSelector
                      onChange={() => {}}
                      showArrow={isOrgAdmin}
                    />
                  </Col>
                  <Col>
                    <Button
                      onClick={() => setDeletingInvitation(invitation)}
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Col>
                </Space>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
