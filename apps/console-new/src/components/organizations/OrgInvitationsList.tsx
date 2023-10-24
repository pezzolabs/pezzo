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
import { GetOrgQuery, OrgRole } from "~/@generated/graphql/graphql";
import { DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import { OrgRoleSelector } from "./OrgRoleSelector";
import colors from "tailwindcss/colors";
import { useCopyToClipboard } from "usehooks-ts";
import { useState } from "react";
import {
  useDeleteOrgInvitationMutation,
  useUpdateOrgInvitationMutation,
} from "~/graphql/hooks/mutations";
import { useCurrentOrgMembership } from "~/lib/hooks/useCurrentOrgMembership";

type Invitation = GetOrgQuery["organization"]["invitations"][0];

interface Props {
  invitations: Invitation[];
}

export const OrgInvitationsList = ({ invitations }: Props) => {
  const { isOrgAdmin } = useCurrentOrgMembership();
  const { mutateAsync: deleteOrgInvitation } = useDeleteOrgInvitationMutation();
  const { mutateAsync: updateOrgInvitation } = useUpdateOrgInvitationMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const [deletingInvitation, setDeletingInvitation] =
    useState<Invitation>(null);
  const [, copy] = useCopyToClipboard();

  const handleCopyInvitation = (invitation: Invitation) => {
    const url = new URL(window.location.origin);
    url.pathname = `/invitations/${invitation.id}/accept`;

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

  const handleUpdateRoleForInvitation = async (
    invitation: Invitation,
    role: OrgRole
  ) => {
    messageApi.open({
      type: "success",
      content: "Role updated",
    });
    await updateOrgInvitation({ invitationId: invitation.id, role });
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
                    <OrgRoleSelector
                      onChange={(role) =>
                        handleUpdateRoleForInvitation(invitation, role)
                      }
                      showArrow={isOrgAdmin}
                      value={invitation.role}
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
