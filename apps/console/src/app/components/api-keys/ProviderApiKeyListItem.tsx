import {
  Avatar,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  message,
  Form,
} from "antd";
import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UPDATE_PROVIDER_API_KEY } from "../../graphql/definitions/mutations/api-keys";
import { gqlClient, queryClient } from "../../lib/graphql";
import { CreateProviderApiKeyInput } from "../../../@generated/graphql/graphql";
import { useEffect } from "react";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { trackEvent } from "../../lib/utils/analytics";
import { providersList } from "./providers-list";

interface Props {
  provider: string;
  value: string | null;
  onSave?: () => void;
  initialIsEditing?: boolean;
  canCancelEdit?: boolean;
}

export const ProviderApiKeyListItem = ({
  provider,
  value,
  onSave,
  initialIsEditing = false,
  canCancelEdit = true,
}: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { currentOrgId } = useCurrentOrganization();
  const [form] = Form.useForm<{ name: string }>();
  const updateKeyMutation = useMutation({
    mutationFn: (data: CreateProviderApiKeyInput) =>
      gqlClient.request(UPDATE_PROVIDER_API_KEY, {
        data: {
          provider: data.provider,
          value: data.value,
          organizationId: data.organizationId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerApiKeys"] });
      onSave && onSave();
    },
  });

  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    form.resetFields();
    if (!isEditing) {
      setEditValue("");
    }
  }, [isEditing, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateKeyMutation.mutateAsync({
      provider,
      value: editValue,
      organizationId: currentOrgId,
    });

    messageApi.success("API key saved successfully");
    trackEvent("provider_api_key_set", { provider });
    form.resetFields();
    setIsEditing(false);
  };

  const iconBase64 = providersList.find(
    (item) => item.provider === provider
  ).iconBase64;

  return (
    <Card size="small" key={provider}>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        onFinish={handleSave}
        autoComplete="off"
      >
        {contextHolder}
        <Row gutter={[12, 12]} align="middle" style={{ width: "100%" }}>
          <Col
            style={{ display: "flex", alignItems: "center", marginRight: 20 }}
          >
            <Avatar size="large" shape="square" src={iconBase64} />
            <Typography.Text style={{ fontSize: 18, marginLeft: 10 }}>
              {provider}
            </Typography.Text>
          </Col>
          <Col
            flex="auto"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            {isEditing ? (
              <Form.Item
                name="apiKey"
                rules={[
                  {
                    required: true,
                    message: "API key is required",
                  },
                ]}
              >
                <Input
                  placeholder="Paste your API key"
                  onChange={(e) => setEditValue(e.target.value)}
                  autoComplete="off"
                  style={{ marginTop: 22 }}
                />
              </Form.Item>
            ) : (
              <Typography.Text style={{ marginLeft: 10, opacity: 0.5 }}>
                {value || "No API key provided"}
              </Typography.Text>
            )}
          </Col>
          <Col style={{ display: "flex", justifyContent: "flex-end" }}>
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateKeyMutation.isLoading}
                  icon={<SaveOutlined height={18} />}
                />

                {canCancelEdit && (
                  <Button
                    onClick={() => setIsEditing(false)}
                    loading={updateKeyMutation.isLoading}
                    icon={<CloseOutlined />}
                    style={{ marginLeft: 10 }}
                  />
                )}
              </>
            ) : (
              <Button
                onClick={handleEdit}
                htmlType="submit"
                icon={<EditOutlined height={18} />}
              />
            )}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
