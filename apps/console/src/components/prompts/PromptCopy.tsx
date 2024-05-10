
import { copyToClipboard } from "~/lib/utils/browser-utils";
import { useState } from "react";
import { trackEvent } from "~/lib/utils/analytics";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { Button } from "@pezzo/ui";

export const PromptCopy = () => {
  const { prompts, isLoading } = useCurrentPrompt();
  const [clicked, setClicked] = useState(false);

  if (isLoading) return null;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        copyToClipboard(prompts.id);
        setClicked(true);
        trackEvent("prompt_id_copied", { promptId: prompts.id });

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
          Copy Prompt ID
        </>
      )}
    </Button>
  );
};
