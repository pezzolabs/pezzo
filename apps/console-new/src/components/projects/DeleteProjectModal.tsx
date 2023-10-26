import { GetProjectsQuery } from "~/@generated/graphql/graphql";
import { useDeleteProjectMutation } from "~/graphql/hooks/mutations";
import { trackEvent } from "~/lib/utils/analytics";
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

interface Props {
  projectToDelete: GetProjectsQuery["projects"][0] | null;
  onClose: () => void;
}

export const DeleteProjectModal = ({ projectToDelete, onClose }: Props) => {
  const { mutate: deleteProject, error } = useDeleteProjectMutation();

  const handleDelete = () => {
    deleteProject(
      { id: projectToDelete.id },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );

    trackEvent("project_delete_confirmed", {
      name: projectToDelete?.name,
    });
  };

  const handleCancel = () => {
    onClose();
    trackEvent("project_delete_cancelled", {
      name: projectToDelete?.name,
    });
  };

  return (
    <AlertDialog open={!!projectToDelete}>
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
            <span className="font-semibold">{projectToDelete?.name}</span>{" "}
            project? All associated data will be lost.
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
