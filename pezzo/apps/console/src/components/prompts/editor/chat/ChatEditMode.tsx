import { ChatMessage } from "./ChatMessage";
import { trackEvent } from "../../../../lib/utils/analytics";
import { useCurrentPrompt } from "../../../../lib/providers/CurrentPromptContext";
import { useEditorContext } from "../../../../lib/providers/EditorContext";
import { Button } from "../../../../../../../libs/ui/src";
import { PlusIcon } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export const ChatEditMode = () => {
  const { promptId } = useCurrentPrompt();
  const { messagesArray } = useEditorContext();
  const { fields, append, remove, move } = messagesArray;

  const handleAdd = () => {
    append({
      role: "user",
      content: "",
    });

    trackEvent("prompt_chat_completion_message_created", {
      promptId,
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    move(result.source.index, result.destination.index);
  };

  return (
    <div className="flex flex-col gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="prompts">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4"
                    >
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex items-center justify-center">
        <Button className="border-dashed" variant="outline" onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add message
        </Button>
      </div>
    </div>
  );
};
