import { Modal, Form, Input, Button, Alert, Typography } from "antd";
import { css } from "@emotion/css";
import { useCreateOrgInvitationMutation } from "../../graphql/hooks/mutations";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { useEffect, useState } from "react";
import { GraphQLErrorResponse } from "../../graphql/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Inputs = {
  email: string;
};

export const InviteOrgMemberModal = ({ open, onClose }: Props) => {
  const { organization } = useCurrentOrganization({
    includeMembers: true,
    includeInvitations: false,
  });
  const [form] = Form.useForm<Inputs>();
  const { mutateAsync: createInvitation } = useCreateOrgInvitationMutation();
  const [error, setError] = useState<string>(null);

  useEffect(() => {
    form.resetFields();
    setError(null);
  }, [open, form, setError]);

  const handleFormFinish = async (values: Inputs) => {
    const { email } = values;

    createInvitation({ email, organizationId: organization.id })
      .then(() => {
        onClose();
      })
      .catch((error: GraphQLErrorResponse) => {
        setError(error.response.errors[0].message);
      });
  };

  return (
    <Modal title="Invite Member" open={open} onCancel={onClose} footer={false}>
      {error && (
        <Alert style={{ marginBottom: 10 }} type="error" message={error} />
      )}

      <Typography.Paragraph>
        Provide an email address to invite a new member to your organization.
      </Typography.Paragraph>

      <Form
        form={form}
        layout="vertical"
        name="basic"
        style={{ maxWidth: 600, marginTop: 20 }}
        onFinish={handleFormFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          fieldId="email"
          rules={[
            {
              required: true,
              type: "email",
              validateTrigger: "onSubmit",
              message: "Must be a valid email",
            },
            () => ({
              validator(_, value) {
                if (
                  organization.members?.find(
                    (member) => member.user.email === value
                  )
                ) {
                  return Promise.reject(
                    new Error("User is already a member of this organization")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="johndoe@yourdomain.com" />
        </Form.Item>

        <Form.Item
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button type="primary" htmlType="submit">
            Send Invitation
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
