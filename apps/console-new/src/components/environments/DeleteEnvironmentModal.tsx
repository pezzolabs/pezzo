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
import { AlertCircle } from "lucide-react";
import { EnvironmentsQuery } from "~/@generated/graphql/graphql";
import { useDeleteEnvironmentMutation } from "~/graphql/hooks/mutations";
import { trackEvent } from "~/lib/utils/analytics";

interface Props {
  environmentToDelete: EnvironmentsQuery["environments"][0] | null;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteEnvironmentModal = ({
  environmentToDelete,
  onClose,
  onDelete,
}: Props) => {
  const { mutate: deleteEnvironment, error } = useDeleteEnvironmentMutation();

  const handleDelete = () => {
    if (environmentToDelete) {
      deleteEnvironment({ id: environmentToDelete.id });
    }

    onDelete();
    trackEvent("environment_delete_confirmed", {
      name: environmentToDelete?.name,
    });
  };

  const onCancel = () => {
    onClose();
    trackEvent("environment_delete_cancelled", {
      name: environmentToDelete?.name,
    });
  };

  return (
    <AlertDialog open={!!environmentToDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.response.errors[0].message}
              </AlertDescription>
            </Alert>
          )}
          <p>
            Are you sure you want to remove{" "}
            <span className="font-semibold">{environmentToDelete?.name}</span>{" "}
            from your environments? All associated data will be lost.
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
