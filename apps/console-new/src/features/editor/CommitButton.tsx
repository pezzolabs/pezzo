import { Button } from "@pezzo/ui";
import { SaveIcon } from "lucide-react";
import { useEditorContext } from "~/lib/providers/EditorContext";

interface Props {
  onClick: () => void;
}

export const CommitButton = ({ onClick }: Props) => {
  const { hasChangesToCommit, getForm } = useEditorContext();
  const form = getForm();
  const isValid = form.formState.isValid;

  return (
    <Button
      variant="outline"
      disabled={!hasChangesToCommit || !isValid}
      onClick={onClick}
    >
      <SaveIcon className="mr-2 h-4 w-4" />
      Commit
    </Button>
  );
};
