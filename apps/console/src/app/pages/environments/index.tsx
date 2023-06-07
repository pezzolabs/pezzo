import { PlusOutlined } from "@ant-design/icons";
import { Button, Spin, Table, Typography, theme } from "antd";
import { CreateEnvironmentModal } from "../../components/environments/CreateEnvironmentModal";
import { useState } from "react";
import { useEnvironments } from "../../lib/hooks/useEnvironments";
import { PezzoApiKeyListItem } from "../../components/api-keys/PezzoApiKeyListItem";

export const EnvironmentsPage = () => {
  const { environments, isLoading } = useEnvironments();
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] =
    useState(false);
  const { token } = theme.useToken();

  const columns = [
    {
      title: "Environment",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "API Key",
      dataIndex: "apiKey",
      key: "apiKey",
      render: (apiKey: string) => <PezzoApiKeyListItem value={apiKey} />,
    },
  ];

  return (
    <>
      <CreateEnvironmentModal
        open={isCreateEnvironmentModalOpen}
        onClose={() => setIsCreateEnvironmentModalOpen(false)}
        onCreated={() => setIsCreateEnvironmentModalOpen(false)}
      />

      <Spin size="large" spinning={isLoading}>
        <Typography.Title level={2}>Environments</Typography.Title>
        <div style={{ marginBottom: token.marginLG }}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsCreateEnvironmentModalOpen(true)}
          >
            New Environment
          </Button>
        </div>

        {environments && (
          <Table
            pagination={false}
            columns={columns}
            dataSource={environments.map((e) => ({
              key: e.id,
              name: e.name,
              apiKey: e.apiKey.id,
            }))}
          />
        )}
      </Spin>
    </>
  );
};
