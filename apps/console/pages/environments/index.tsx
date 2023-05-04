import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, List, Typography } from "antd";
import { InlineCodeSnippet } from "../../components/common/InlineCodeSnippet";
import { CreateEnvironmentModal } from "../../components/environments/CreateEnvironmentModal";
import { GET_ALL_ENVIRONMENTS } from "../../graphql/queries/environments";
import { gqlClient } from "../../lib/graphql";
import { useState } from "react";

const EnvironmentsPage = () => {
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] =
    useState(false);

  const { data } = useQuery({
    queryKey: ["environments"],
    queryFn: () => gqlClient.request(GET_ALL_ENVIRONMENTS),
  });


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

      {data?.environments && (
        <List
          style={{ maxWidth: 600 }}
          bordered
          dataSource={data.environments}
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

export default EnvironmentsPage;
