import { useQuery } from "@tanstack/react-query";
import { PromptListItem } from "../../components/prompts/PromptListItem";
import { GET_ALL_PROMPTS } from "../../graphql/queries/prompts";
import { gqlClient } from "../../lib/graphql";
import { PlusOutlined } from "@ant-design/icons";
import { CreatePromptModal } from "../../components/prompts/CreatePromptModal";
import { useState } from "react";
import { css } from "@emotion/css";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useCurrentProject } from "../../lib/providers/CurrentProjectContext";

export const PromptsPage = () => {
  const { project } = useCurrentProject();
  console.log(project);
  const navigate = useNavigate();
  const [isCreatePromptModalOpen, setIsCreatePromptModalOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROMPTS, { data: { projectId: project.id } }),
  });

  return (
    <>
      <CreatePromptModal
        open={isCreatePromptModalOpen}
        onClose={() => setIsCreatePromptModalOpen(false)}
        onCreated={(id) => navigate(`/projects/${project.id}/prompts/${id}`)}
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
                integrationId={prompt.integrationId}
                onClick={() =>
                  navigate(`/projects/${project.id}/prompts/${prompt.id}`)
                }
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
