import { Alert, Form, Input, Modal, Space, Typography, theme } from "antd";
import { GetProjectsQuery } from "../../../@generated/graphql/graphql";
import { useUpdateProjectSettingsMutation } from "../../graphql/hooks/mutations";
import { trackEvent } from "../../lib/utils/analytics";
import { useEffect } from "react";

interface Props {
  projectToRename: GetProjectsQuery["projects"][0] | null;
  onClose: () => void;
  onRename: () => void;
}

export const RenameProjectModal = ({
  projectToRename,
  onClose,
  onRename,
}: Props) => {
  const [form] = Form.useForm<{ name: string }>();
  const { token } = theme.useToken();
  const { mutate: updateProjectSettings, error } =
    useUpdateProjectSettingsMutation();

  useEffect(() => {
    form.resetFields();
  }, [projectToRename, form]);

  const handleRename = () => {
    updateProjectSettings(
      { projectId: projectToRename.id, name: form.getFieldValue("name") },
      {
        onSuccess: () => {
          onRename();
        },
      }
    );

    trackEvent("project_rename_submitted", {
      name: projectToRename?.name,
    });
  };

  const onCancel = () => {
    onClose();
    trackEvent("project_rename_cancelled", {
      name: projectToRename?.name,
    });
  };

  return (
    <Modal
      title="Rename Project"
      open={projectToRename !== null}
      onCancel={onCancel}
      okText="Rename"
      okButtonProps={{
        form: "rename-project-form",
        htmlType: "submit",
      }}
    >
      {error && (
        <Alert type="error" message={error.response.errors[0].message} />
      )}
      <p>
        Choose a new name for the{" "}
        <Typography.Text style={{ fontWeight: 800 }}>
          {projectToRename?.name}
        </Typography.Text>{" "}
        project.
      </p>

      <Form
        style={{ marginTop: token.marginLG }}
        form={form}
        name="rename-project-form"
        onFinish={handleRename}
        initialValues={{
          name: projectToRename?.name,
        }}
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

          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Name must be provided",
              },
            ]}
          >
            <Input placeholder="Project name" />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};
