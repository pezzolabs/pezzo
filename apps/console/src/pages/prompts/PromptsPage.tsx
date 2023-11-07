import { Button, Card } from "@pezzo/ui";
import { CreatePromptModal } from "~/components/prompts/CreatePromptModal";
import { useState } from "react";
import { usePrompts } from "~/lib/hooks/usePrompts";
import { trackEvent } from "~/lib/utils/analytics";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import { MoveRightIcon, PlusIcon, TrashIcon } from "lucide-react";
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
  const { mutate: deletePrompt, error: deletePromptError } =
    useDeletePromptMutation();

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

      <div className="mb-6 border-b border-b-border">
        <div className="container flex h-24 max-w-[660px] items-center justify-between">
          <h1>Prompts</h1>
          <Button onClick={handleCreatePrompt}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </div>

      <div className="container max-w-[660px]">
        <div className="space-y-4">
          {prompts &&
            prompts.map((prompt) => (
              <Card
                className="group mb-4 flex h-20 cursor-pointer items-center gap-x-3 p-4 ring-primary hover:ring-2 transition-all"
                onClick={(e) => handleClickPrompt(e, prompt.id)}
                key={prompt.id}
              >
                <BoxIcon className="text-primary" />
                <div className="flex-1 font-medium">{prompt.name}</div>
                <Button
                  className="hidden group-hover:inline-flex"
                  onClick={(e) => handleDeletePromptClick(e, prompt)}
                  size="icon"
                  variant="destructiveOutline"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
                <MoveRightIcon className="h-4 w-4 opacity-70" />
              </Card>
            ))}

          {prompts && prompts.length === 0 && (
            <Card
              className="group mb-4 flex flex-col h-24 cursor-pointer items-center justify-center gap-2 p-4 ring-primary border-2 border-dashed opacity-70 hover:opacity-100"
              onClick={handleCreatePrompt}
            >
              <PlusIcon className="h-5 w-5 opacity-70 font-medium" />
              Create your first prompt
            </Card>
          )}
        </div>
      </div>
    </>
  );
};
