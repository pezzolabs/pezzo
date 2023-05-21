import { PlusOutlined } from "@ant-design/icons";
import { Button, List, Spin, Typography, theme } from "antd";
import { InlineCodeSnippet } from "../../components/common/InlineCodeSnippet";
import { CreateEnvironmentModal } from "../../components/environments/CreateEnvironmentModal";
import { useState } from "react";
import { useEnvironments } from "../../lib/hooks/useEnvironments";

export const EnvironmentsPage = () => {
  const { environments, isLoading } = useEnvironments();
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] =
    useState(false);
  const { token } = theme.useToken();

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
          <List
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
      </Spin>
    </>
  );
};
