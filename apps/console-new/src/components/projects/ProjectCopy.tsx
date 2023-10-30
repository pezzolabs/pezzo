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
      size="sm"
      className="text-primary-foreground border border-slate-700 hover hover:bg-slate-800"
      onClick={() => {
        copyToClipboard(project.id);
        setClicked(true);
        trackEvent("project_id_copied", { projectId: project.id });

        setTimeout(() => {
          setClicked(false);
        }, 3000);
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
