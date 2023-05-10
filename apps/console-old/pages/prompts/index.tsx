import { useQuery } from "@tanstack/react-query";
import { PromptListItem } from "../../components/prompts/PromptListItem";
import { GET_ALL_PROMPTS } from "../../graphql/queries/prompts";
import { gqlClient } from "../../lib/graphql";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { CreatePromptModal } from "../../components/prompts/CreatePromptModal";
import { useState } from "react";
import { css } from "@emotion/css";
import { Button, Typography } from "antd";

const PromptsPage = () => {
  const router = useRouter();
  const [isCreatePromptModalOpen, setIsCreatePromptModalOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: () => gqlClient.request(GET_ALL_PROMPTS),
  });

  return (
    <>
      <CreatePromptModal
        open={isCreatePromptModalOpen}
        onClose={() => setIsCreatePromptModalOpen(false)}
        onCreated={(id) => router.push(`/prompts/${id}`)}
      />

      <Typography.Title level={1}>Prompts</Typography.Title>
      {isLoading && <p>Loading...</p>}

      {data && (
        <div
          className={css`
            max-width: 600px;
          `}
        >
          <div
            className={css`
              margin-bottom: 14px;
            `}
          >
            <Button
              icon={<PlusOutlined />}
              onClick={() => setIsCreatePromptModalOpen(true)}
            >
              New Prompt
            </Button>
          </div>
          {data.prompts.map((prompt) => (
            <div key={prompt.id} style={{ marginBottom: 14 }}>
              <PromptListItem
                name={prompt.name}
                onClick={() => router.push(`/prompts/${prompt.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PromptsPage;
