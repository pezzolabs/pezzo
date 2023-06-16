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
import { GetOrgQuery, OrgRole } from "../../../@generated/graphql/graphql";
import { Avatar } from "../common/Avatar";
import { DeleteOutlined } from "@ant-design/icons";
import { OrgRoleSelector } from "./OrgRoleSelector";
import { useState } from "react";
import {
  useDeleteOrgMemberMutation,
  useUpdateOrgMemberRoleMutation,
} from "../../graphql/hooks/mutations";
import { useAuthContext } from "../../lib/providers/AuthProvider";
import { useCurrentOrgMembership } from "../../lib/hooks/useCurrentOrgMembership";

type Member = GetOrgQuery["organization"]["members"][0];

interface Props {
  members: Member[];
}

export const OrgMembersList = ({ members }: Props) => {
  const { isOrgAdmin } = useCurrentOrgMembership();
  const { currentUser } = useAuthContext();
  const { mutateAsync: deleteOrgMember } = useDeleteOrgMemberMutation();
  const { mutate: updateOrgMemberRole } = useUpdateOrgMemberRoleMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const [deletingMember, setDeletingMember] = useState<Member>(null);

  const handleDeleteMember = async (member: Member) => {
    messageApi.open({
      type: "success",
      content: `${member.user.name} has been removed from the organization`,
    });
    await deleteOrgMember({ id: member.id });
    setDeletingMember(null);
  };

  const handleRoleChange = async (member: Member, role: OrgRole) => {
    updateOrgMemberRole({ id: member.id, role: role });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Are you sure?"
        open={!!deletingMember}
        okType="danger"
        okText="Delete"
        onOk={() => handleDeleteMember(deletingMember)}
        onCancel={() => setDeletingMember(null)}
      >
        <p>
          Are you sure you want to remove{" "}
          <Typography.Text style={{ fontWeight: 800 }}>
            {deletingMember?.user.name}
          </Typography.Text>{" "}
          from your organization?
        </p>
      </Modal>
      <List
        itemLayout="horizontal"
        dataSource={members}
        renderItem={(member) => (
          <List.Item>
            <Card style={{ width: "100%" }} size="small">
              <Row align="middle" style={{ width: "100%" }}>
                <Col flex="1">
                  <Row align="middle">
                    <Space>
                      <Col>
                        <Avatar user={member.user} size="large" />
                      </Col>
                      <Col>
                        <Typography.Text style={{ display: "block" }}>
                          {member.user.name}
                          {member.user.id === currentUser.id && " (You)"}
                        </Typography.Text>
                        <Typography.Text
                          type="secondary"
                          style={{ display: "block" }}
                        >
                          {member.user.email}
                        </Typography.Text>
                      </Col>
                    </Space>
                  </Row>
                </Col>
                <Space size="large">
                  <Col>
                    <Typography.Text type="secondary">Role: </Typography.Text>
                    <OrgRoleSelector
                      disabled={
                        !isOrgAdmin || member.user.id === currentUser.id
                      }
                      value={member.role}
                      onChange={(newRole) => handleRoleChange(member, newRole)}
                      showArrow={isOrgAdmin}
                    />
                  </Col>
                  <Col>
                    {isOrgAdmin && (
                      <Button
                        disabled={member.user.id === currentUser.id}
                        onClick={() => setDeletingMember(member)}
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                      />
                    )}
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
