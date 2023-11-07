import { GraphQLErrorResponse } from "~/graphql/types";
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

type Props = {
  open: boolean;
  title?: string;
  description?: string | React.ReactNode;
  error?: GraphQLErrorResponse;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const GenericDestructiveConfirmationModal = ({
  open,
  error,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
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
            {description}
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
