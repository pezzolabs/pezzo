import { Alert, Form, Input, Modal, Space, Typography, theme } from "antd";
import { useCallback } from "react";
import { useCreateProjectMutation } from "~/graphql/hooks/mutations";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { trackEvent } from "~/lib/utils/analytics";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateNewProjectModal = ({ open, onClose, onCreated }: Props) => {
  const [form] = Form.useForm<{ projectName: string }>();
  const { organization } = useCurrentOrganization();
  const navigate = useNavigate();
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
    createProject(
      {
        name: form.getFieldValue("projectName"),
        organizationId: organization.id,
      },
      {
        onSuccess: (data) => {
          onCreated();
          navigate(`/projects/${data.createProject.id}`);
        },
      }
    );

    trackEvent("project_form_submitted");
  }, [createProject, onCreated, form, organization.id, navigate]);

  const onCancel = () => {
    onClose();
    trackEvent("project_form_cancelled");
  };

  return (
    <Modal
      title={
        <Typography.Title level={3} style={{ margin: 0 }}>
          Create Project
        </Typography.Title>
      }
      open={open}
      onCancel={onCancel}
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
