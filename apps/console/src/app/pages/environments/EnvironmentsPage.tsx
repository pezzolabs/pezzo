import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Spin, Typography, theme, Row, Col } from "antd";
import { CreateEnvironmentModal } from "../../components/environments/CreateEnvironmentModal";
import { DeleteEnvironmentModal } from "../../components/environments/DeleteEnvironmentModal";
import { useState } from "react";
import { useEnvironments } from "../../lib/hooks/useEnvironments";
import { EnvironmentsQuery } from "../../../@generated/graphql/graphql";
import { trackEvent } from "../../lib/utils/analytics";

type Environment = EnvironmentsQuery["environments"][0];

export const EnvironmentsPage = () => {
  const { environments, isLoading } = useEnvironments();
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] =
    useState(false);
  const [environmentToDelete, setEnvironmentToDelete] =
    useState<Environment | null>(null);
  const { token } = theme.useToken();

  const onCreateEnvironmentModalOpen = () => {
    setIsCreateEnvironmentModalOpen(true);
    trackEvent("environment_create_modal_open");
  };

  const onDeleteEnvironmentModalOpen = (environment: Environment) => () => {
    setEnvironmentToDelete(environment);
    trackEvent("environment_delete_modal_open", { name: environment.name });
  };

  return (
    <>
      <CreateEnvironmentModal
        open={isCreateEnvironmentModalOpen}
        onClose={() => setIsCreateEnvironmentModalOpen(false)}
        onCreated={() => setIsCreateEnvironmentModalOpen(false)}
      />

      <DeleteEnvironmentModal
        environmentToDelete={environmentToDelete}
        onClose={() => setEnvironmentToDelete(null)}
        onDelete={() => setEnvironmentToDelete(null)}
      />

      <Spin size="large" spinning={isLoading}>
        <Typography.Title level={2}>Environments</Typography.Title>
        <div style={{ marginBottom: token.marginLG }}>
          <Button
            icon={<PlusOutlined />}
            onClick={onCreateEnvironmentModalOpen}
          >
            New Environment
          </Button>
        </div>

        {environments &&
          environments.map((environment) => (
            <Card
              key={environment.id}
              style={{ marginBottom: 10, maxWidth: 600 }}
              size="small"
            >
              <Row justify="space-between" align="middle">
                <Col>{environment.name}</Col>
                <Col>
                  <Button
                    onClick={onDeleteEnvironmentModalOpen(environment)}
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          ))}
      </Spin>
    </>
  );
};
