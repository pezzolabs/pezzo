import { ChatMessage } from "./ChatMessage";
import { trackEvent } from "~/lib/utils/analytics";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { useEditorContext } from "~/lib/providers/EditorContext";
import { Button } from "@pezzo/ui";
import { PlusIcon } from "lucide-react";

export const ChatEditMode = () => {
  const { promptId } = useCurrentPrompt();
  const { messagesArray } = useEditorContext();
  const { fields, append, remove } = messagesArray;

  const handleAdd = () => {
    append({
      role: "user",
      content: "",
    });

    trackEvent("prompt_chat_completion_message_created", {
      promptId,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <ChatMessage
          key={field.id}
          index={index}
          canDelete={fields.length !== 1}
          onDelete={() => {
            remove(index);
            trackEvent("prompt_chat_completion_message_deleted", {
              promptId,
            });
          }}
        />
      ))}

      <div className="flex items-center justify-center">
        <Button className="border-dashed" variant="outline" onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add message
        </Button>
      </div>
    </div>
  );
};
