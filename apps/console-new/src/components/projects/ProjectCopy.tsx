import { Button } from "@pezzo/ui";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { copyToClipboard } from "~/lib/utils/browser-utils";
import { useState } from "react";
import { trackEvent } from "~/lib/utils/analytics";
import { CheckIcon, CopyIcon } from "lucide-react";

export const ProjectCopy = () => {
  const { project, isLoading } = useCurrentProject();
  const [clicked, setClicked] = useState(false);

  if (isLoading) return null;

  return (
    <Button
      className="bg-white border text-primary"
      onClick={() => {
        copyToClipboard(project.id);
        setClicked(true);
        trackEvent("project_id_copied", { projectId: project.id });
      }}
    >
      {clicked ? (
        <>
          <CheckIcon className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon className="mr-2 h-4 w-4" />
          Copy Project ID
        </>
      )}
    </Button>
  );
};
