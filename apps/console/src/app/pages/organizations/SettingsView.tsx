import { Button, Form, Input } from "antd";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { SaveOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useUpdateOrgSettingsMutation } from "../../lib/hooks/mutations";

type Inputs = {
  name: string;
};

export const SettingsView = () => {
  const { organization } = useCurrentOrganization();
  const [form] = Form.useForm<Inputs>();
  const [isTouched, setIsTouched] = useState(false);
  const { mutate: updateSettings, isLoading } = useUpdateOrgSettingsMutation();

  const handleFormFinish = async (values: Inputs) => {
    updateSettings(
      { organizationId: organization.id, name: values.name },
      {
        onSuccess: () => {
          setIsTouched(false);
        },
      }
    );
  };

  const initialValues = useMemo(
    () => ({
      name: organization.name,
    }),
    [organization]
  );

  return (
    organization && (
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
        name="basic"
        onFinish={handleFormFinish}
        style={{ maxWidth: 600 }}
        onChange={() => setIsTouched(true)}
      >
        <Form.Item
          label="Organization Name"
          name="name"
          fieldId="name"
          shouldUpdate={true}
          rules={[
            {
              required: false,
              validateTrigger: "onSubmit",
              message: "Must be a valid name",
            },
          ]}
        >
          <Input placeholder="My Organization" />
        </Form.Item>

        <Form.Item>
          <Button
            loading={isLoading}
            disabled={!isTouched}
            icon={<SaveOutlined />}
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    )
  );
};
