import {
  Alert,
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogDescription,
  Button,
  AlertTitle,
  AlertDescription,
} from "@pezzo/ui";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { useNavigate } from "react-router-dom";
import { useDeletePromptMutation } from "~/graphql/hooks/mutations";
import { trackEvent } from "~/lib/utils/analytics";
import { GetAllPromptsQuery } from "~/@generated/graphql/graphql";
import { AlertCircle } from "lucide-react";

type Prompt = GetAllPromptsQuery["prompts"][0];

interface Props {
  promptToDelete: Prompt | null;
  onClose: () => void;
}

export const DeletePromptConfirmationModal = ({
  promptToDelete,
  onClose,
}: Props) => {
  const { projectId } = useCurrentProject();
  const navigate = useNavigate();

  const { mutate, error, isSuccess } = useDeletePromptMutation();

  const handleDelete = () => {
    mutate(promptToDelete.id, {
      onSuccess: () => {
        onClose();
        navigate(`/projects/${projectId}/prompts`);
      },
    });
    trackEvent("prompt_delete_confirmed");
  };

  const handleCancel = () => {
    trackEvent("prompt_delete_cancelled");
    onClose();
  };

  return (
    <AlertDialog open={!!promptToDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>
                {error.response.errors[0].message}
              </AlertDescription>
            </Alert>
          )}
          <p>
            Are you sure you want to delete the{" "}
            <span className="font-semibold">{promptToDelete?.name}</span>{" "}
            prompt? All associated data will be lost.
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
