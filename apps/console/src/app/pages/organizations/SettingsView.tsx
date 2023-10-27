import { Button, Form, Input } from "antd";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { SaveOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useUpdateOrgSettingsMutation } from "../../graphql/hooks/mutations";
import { trackEvent } from "../../lib/utils/analytics";

type Inputs = {
  name: string;
};

export const SettingsView = () => {
  const { organization } = useCurrentOrganization();
  const [form] = Form.useForm<Inputs>();
  const [isTouched, setIsTouched] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(true);
  const { mutate: updateSettings, isLoading } = useUpdateOrgSettingsMutation();

  const handleFormFinish = async (values: Inputs) => {
    if (!organization) return;
    values.name = values.name.trim();

    if (values.name === organization.name) {
      form.setFields([
        {
          name: "name",
          errors: ["This is already your organization name."],
        },
      ]);
    } else {
      updateSettings(
        { organizationId: organization?.id, name: values.name },
        {
          onSuccess: () => {
            setIsTouched(false);
          },
        }
      );

      trackEvent("organization_settings_form_submitted");
    }
  };

  const initialValues = useMemo(
    () => ({
      name: organization?.name,
    }),
    [organization]
  );

  if (!organization) return null;

  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      name="basic"
      onFinish={handleFormFinish}
      style={{ maxWidth: 600 }}
      onValuesChange={(changedValues) => {
        if ("name" in changedValues) {
          setIsTouched(true);
          setIsNameEmpty(changedValues.name.trim() === "");
        }
      }}
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
          disabled={!isTouched || isNameEmpty}
          icon={<SaveOutlined />}
          type="primary"
          htmlType="submit"
        >
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};
