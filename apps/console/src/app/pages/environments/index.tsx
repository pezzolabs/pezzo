import { PlusOutlined } from "@ant-design/icons";
import { Button, List, Typography } from "antd";
import { InlineCodeSnippet } from "../../components/common/InlineCodeSnippet";
import { CreateEnvironmentModal } from "../../components/environments/CreateEnvironmentModal";
import { useState } from "react";
import { useEnvironments } from "../../lib/hooks/useEnvironments";

export const EnvironmentsPage = () => {
  const { environments } = useEnvironments();
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] =
    useState(false);

  return (
    <>
      <CreateEnvironmentModal
        open={isCreateEnvironmentModalOpen}
        onClose={() => setIsCreateEnvironmentModalOpen(false)}
        onCreated={() => setIsCreateEnvironmentModalOpen(false)}
      />
      <Typography.Title level={1}>Environments</Typography.Title>
      <div style={{ marginBottom: 12 }}>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsCreateEnvironmentModalOpen(true)}
        >
          New Environment
        </Button>
      </div>

      {environments && (
        <List
          style={{ maxWidth: 600 }}
          bordered
          dataSource={environments}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>
                {item.name} <InlineCodeSnippet>{item.slug}</InlineCodeSnippet>
              </Typography.Text>
            </List.Item>
          )}
        />
      )}
    </>
  );
};
