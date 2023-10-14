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
  Modal,
} from "antd";
import {
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UPDATE_PROVIDER_API_KEY } from "../../graphql/definitions/mutations/api-keys";
import { gqlClient, queryClient } from "../../lib/graphql";
import { CreateProviderApiKeyInput } from "../../../@generated/graphql/graphql";
import { useEffect } from "react";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { trackEvent } from "../../lib/utils/analytics";
import { providersList } from "./providers-list";
import { useDeleteProviderApiKeyMutation } from "../../graphql/hooks/mutations";

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
  const { mutateAsync: deleteProviderApiKey } =
    useDeleteProviderApiKeyMutation();
  const [form] = Form.useForm<{ apiKey: string }>();
  const [deletingProviderApiKey, setDeletingProviderApiKey] =
    useState<string>(null);
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

  const handleDeleteProvider = async (provider: string) => {
    await deleteProviderApiKey({ provider, organizationId: currentOrgId });
    messageApi.open({
      type: "success",
      content: "Provider api key deleted",
    });
    trackEvent("provider_api_key_deleted", { provider });
    setDeletingProviderApiKey(null);
  };

  const [isEditing, setIsEditing] = useState(initialIsEditing);

  useEffect(() => {
    form.resetFields();
  }, [isEditing, form]);

  const handleSave = async () => {
    await updateKeyMutation.mutateAsync({
      provider,
      value: form.getFieldValue("apiKey"),
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
    <>
      <Modal
        title="Are you sure?"
        open={!!deletingProviderApiKey}
        okType="danger"
        okText="Delete"
        onOk={() => handleDeleteProvider(deletingProviderApiKey)}
        onCancel={() => setDeletingProviderApiKey(null)}
      >
        <p>Are you sure you want to delete the provider API key?</p>
      </Modal>
      <Card size="small" key={provider}>
        <Form
          form={form}
          layout="vertical"
          name="update-api-key"
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
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: "API key is required",
                    },
                  ]}
                >
                  <Input
                    placeholder="Paste your API key"
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
                <Form.Item noStyle>
                  <Button
                    onClick={() => setIsEditing(true)}
                    icon={<EditOutlined height={18} />}
                  />
                  {value && (
                    <Button
                      onClick={() => setDeletingProviderApiKey(provider)}
                      danger
                      icon={<DeleteOutlined height={18} />}
                      style={{ marginLeft: 10 }}
                    />
                  )}
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};
