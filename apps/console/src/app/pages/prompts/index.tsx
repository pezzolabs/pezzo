import { PromptListItem } from "../../components/prompts/PromptListItem";
import { PlusOutlined } from "@ant-design/icons";
import { CreatePromptModal } from "../../components/prompts/CreatePromptModal";
import { useState } from "react";
import { css } from "@emotion/css";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetPrompts } from "../../lib/hooks/queries";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export const PromptsPage = () => {
  const navigate = useNavigate();
  const [isCreatePromptModalOpen, setIsCreatePromptModalOpen] = useState(false);
  const sessionData = useSessionContext();
  const { data, isLoading } = useGetPrompts();

  // we have to strictly check for true here because of typescript issues with the useSessionContext hook
  if (sessionData.loading === true) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CreatePromptModal
        open={isCreatePromptModalOpen}
        onClose={() => setIsCreatePromptModalOpen(false)}
        onCreated={(id) => navigate(`/prompts/${id}`)}
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
                onClick={() => navigate(`/prompts/${prompt.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
