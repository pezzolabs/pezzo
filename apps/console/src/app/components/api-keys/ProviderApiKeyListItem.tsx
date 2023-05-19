import { Avatar, Card, Row, Col, Typography, Button, Input } from "antd";
import styled from "@emotion/styled";
import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UPDATE_PROVIDER_API_KEY } from "../../graphql/mutations/api-keys";
import { gqlClient, queryClient } from "../../lib/graphql";
import { CreateProviderApiKeyInput } from "@pezzo/graphql";
import { useEffect } from "react";
import { useCurrentProject } from "../../lib/providers/CurrentProjectContext";

const APIKeyContainer = styled.div`
  display: flex;
  align-items: center;
  width: 600px;
`;

interface Props {
  provider: string;
  value: string | null;
  iconBase64: string;
}

export const ProviderApiKeyListItem = ({
  provider,
  value,
  iconBase64,
}: Props) => {
  const { project } = useCurrentProject();
  const updateKeyMutation = useMutation({
    mutationFn: (data: CreateProviderApiKeyInput) =>
      gqlClient.request(UPDATE_PROVIDER_API_KEY, {
        data: {
          provider: data.provider,
          value: data.value,
          projectId: data.projectId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerApiKeys"] });
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    if (!isEditing) {
      setEditValue("");
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateKeyMutation.mutateAsync({
      provider,
      value: editValue,
      projectId: project.id,
    });
    setIsEditing(false);
  };

  return (
    <Card size="small" key={provider}>
      <APIKeyContainer>
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
              <Input
                placeholder="Paste your API key"
                onChange={(e) => setEditValue(e.target.value)}
                autoComplete="off"
              />
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
                  onClick={handleSave}
                  loading={updateKeyMutation.isLoading}
                  icon={<SaveOutlined height={18} />}
                />
                <Button
                  onClick={() => setIsEditing(false)}
                  loading={updateKeyMutation.isLoading}
                  icon={<CloseOutlined />}
                  style={{ marginLeft: 10 }}
                />
              </>
            ) : (
              <Button
                onClick={handleEdit}
                icon={<EditOutlined height={18} />}
              />
            )}
          </Col>
        </Row>
      </APIKeyContainer>
    </Card>
  );
};
