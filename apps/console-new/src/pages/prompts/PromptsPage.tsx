import { Button, Card } from "@pezzo/ui";
import { CreatePromptModal } from "~/components/prompts/CreatePromptModal";
import { useState } from "react";
import { usePrompts } from "~/lib/hooks/usePrompts";
import { trackEvent } from "~/lib/utils/analytics";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import { PlusIcon, TrashIcon } from "lucide-react";
import { GetAllPromptsQuery } from "~/@generated/graphql/graphql";
import { BoxIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { GenericDestructiveConfirmationModal } from "~/components/common/GenericDestructiveConfirmationModal";
import { useDeletePromptMutation } from "~/graphql/hooks/mutations";

type Prompt = GetAllPromptsQuery["prompts"][0];

export const PromptsPage = () => {
  usePageTitle("Prompts");
  const { projectId } = useCurrentProject();
  const { prompts } = usePrompts();
  const navigate = useNavigate();
  const [isCreatePromptModalOpen, setIsCreatePromptModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const { mutate: deletePrompt, error: deletePromptError } = useDeletePromptMutation();

  const handleCreatePrompt = () => {
    setIsCreatePromptModalOpen(true);
    trackEvent("prompt_create_modal_opened");
  };

  const handleClickPrompt = (e: React.MouseEvent, promptId: string) => {
    navigate(`/projects/${projectId}/prompts/${promptId}`);
    trackEvent("prompt_nav_clicked", { promptId });
  };

  const handleDeletePromptClick = (e: React.MouseEvent, prompt: Prompt) => {
    e.stopPropagation();
    setPromptToDelete(prompt);
    trackEvent("prompt_delete_modal_opened", { name: prompt.name });
  };

  const handleDeletePromptConfirm = (promptId: string) => {
    deletePrompt(promptToDelete.id, {
      onSuccess: () => {
        setPromptToDelete(null);
      },
    });
    trackEvent("prompt_delete_confirmed");
  };

  return (
    <>
      <CreatePromptModal
        open={isCreatePromptModalOpen}
        onClose={() => setIsCreatePromptModalOpen(false)}
        onCreated={() => setIsCreatePromptModalOpen(false)}
      />

      <GenericDestructiveConfirmationModal
        title="Delete Prompt"
        description="Are you sure you want to delete this prompt? All associated data will be lost."
        open={!!promptToDelete}
        onCancel={() => setPromptToDelete(null)}
        onConfirm={() => handleDeletePromptConfirm(promptToDelete.id)}
        error={deletePromptError}
      />
      

      <div className="flex gap-4">
        <h1 className="mb-4 text-3xl font-semibold flex-1">Prompts</h1>
        <div className="mb-4">
          <Button onClick={handleCreatePrompt}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </div>

      <div className="max-w-[600px]">
        {prompts &&
          prompts.map((prompt) => (
            <Card
              className="mb-4 cursor-pointer p-4 ring-primary hover:ring-2"
              onClick={(e) => handleClickPrompt(e, prompt.id)}
              key={prompt.id}
            >
              <div className="flex items-center gap-4">
                <div>
                  <BoxIcon />
                </div>
                <div className="flex-1">{prompt.name}</div>
                <div>
                  <Button
                    onClick={(e) => handleDeletePromptClick(e, prompt)}
                    size="icon"
                    variant="destructiveOutline"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
};
