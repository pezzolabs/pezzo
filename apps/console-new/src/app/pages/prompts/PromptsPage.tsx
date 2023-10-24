import { useQuery } from "@tanstack/react-query";
import { PromptListItem } from "../../components/prompts/PromptListItem";
import { GET_ALL_PROMPTS } from "../../graphql/definitions/queries/prompts";
import { gqlClient } from "../../lib/graphql";
import { PlusOutlined } from "@ant-design/icons";
import { CreatePromptModal } from "../../components/prompts/CreatePromptModal";
import { useState } from "react";
import { css } from "@emotion/css";
import { Button, Space, Spin, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import { trackEvent } from "../../lib/utils/analytics";
import { usePageTitle } from "../../lib/hooks/usePageTitle";

export const PromptsPage = () => {
  const { project, isLoading: isProjectsLoading } = useCurrentProject();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [isCreatePromptModalOpen, setIsCreatePromptModalOpen] = useState(false);
  const { data, isLoading: isLoadingPrompts } = useQuery({
    queryKey: ["prompts", project?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROMPTS, { data: { projectId: project?.id } }),
    enabled: !!project?.id,
  });
  usePageTitle(project?.name && `${project.name} Prompts`);

  const isLoading = isLoadingPrompts || isProjectsLoading;

  const onCreatePromptModalOpen = () => {
    setIsCreatePromptModalOpen(true);
    trackEvent("prompt_modal_opened");
  };

  const onPromptClick = (promptId: string) => () => {
    navigate(`/projects/${project.id}/prompts/${promptId}`);
    trackEvent("prompt_nav_clicked", { promptId });
  };

  return (
    <>
      <CreatePromptModal
        open={isCreatePromptModalOpen}
        onClose={() => setIsCreatePromptModalOpen(false)}
        onCreated={(id) => navigate(`/projects/${project.id}/prompts/${id}`)}
      />

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Title level={2}>Prompts</Typography.Title>

        <Spin size="large" spinning={isLoading}>
          <div
            className={css`
              max-width: 640px;
              min-height: 500px;
              padding: ${isLoading ? token.paddingLG : 0};
            `}
          >
            <Button
              icon={<PlusOutlined />}
              style={{
                marginBottom: token.marginLG,
              }}
              onClick={onCreatePromptModalOpen}
            >
              New Prompt
            </Button>

            {data?.prompts?.map((prompt) => (
              <div key={prompt.id} style={{ marginBottom: 14 }}>
                <PromptListItem
                  name={prompt.name}
                  isDraft={prompt.isDraft}
                  onClick={onPromptClick(prompt.id)}
                />
              </div>
            ))}
          </div>
        </Spin>
      </Space>
    </>
  );
};
