import { Alert, Form, Input, Modal, Space, Typography, theme } from "antd";
import { useCallback } from "react";
import { useCreateProjectMutation } from "../../lib/hooks/mutations";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateNewProjectModal = ({ open, onClose, onCreated }: Props) => {
  const [form] = Form.useForm<{ projectName: string }>();
  const { organization } = useCurrentOrganization();
  const {
    mutateAsync: createProject,
    error,
    isLoading: isCreatingProject,
  } = useCreateProjectMutation({
    onSuccess: () => {
      form.resetFields();
      onCreated();
    },
  });
  const { token } = theme.useToken();

  const handleCreateProject = useCallback(async () => {
    void createProject({
      name: form.getFieldValue("projectName"),
      organizationId: organization.id,
    }).catch(() => {
      form.resetFields();
    });
  }, [createProject, form, organization.id]);

  return (
    <Modal
      title={
        <Typography.Title level={3} style={{ margin: 0 }}>
          Create Project
        </Typography.Title>
      }
      open={open}
      onCancel={onClose}
      okText="Create"
      okButtonProps={{
        form: "create-project-form",
        htmlType: "submit",
        loading: isCreatingProject,
      }}
    >
      <Form
        style={{ marginTop: token.marginLG }}
        form={form}
        name="create-project-form"
        onFinish={handleCreateProject}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {error && (
            <Alert
              type="error"
              description={
                error?.response.errors?.[0].message ?? "Something went wrong"
              }
            />
          )}
          <Typography.Text>Name</Typography.Text>

          <Form.Item
            name="projectName"
            rules={[
              {
                required: true,
                message: "Please set a name to your project",
              },
            ]}
          >
            <Input placeholder="Content Creation" />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};
