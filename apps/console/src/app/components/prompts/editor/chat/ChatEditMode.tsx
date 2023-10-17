import { Button, Card, Form, List, FormListFieldData } from "antd";
import { ChatMessage } from "./ChatMessage";
import { PlusOutlined } from "@ant-design/icons";
import { usePromptVersionEditorContext } from "../../../../lib/providers/PromptVersionEditorContext";
import { trackEvent } from "../../../../lib/utils/analytics";
import { useCurrentPrompt } from "../../../../lib/providers/CurrentPromptContext";
import { useEffect } from "react";
import { findVariables } from "../../../../lib/utils/find-variables";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const ChatEditMode = () => {
  const { promptId } = useCurrentPrompt();
  const { form, setVariables } = usePromptVersionEditorContext();
  const content = Form.useWatch(["content"], { form });

  useEffect(() => {
    if (content?.messages) {
      let variables = [];
      content.messages
        .filter((message) => !!message)
        .forEach((message) => {
          const foundVariables = findVariables(message?.content);
          if (message?.content) variables = [...variables, ...foundVariables];
        });

      setVariables(variables);
    }
  }, [content, setVariables]);

  const handleAdd = () => {
    const currentMessages = form.getFieldValue(["content", "messages"]);
    form.setFieldValue(
      ["content", "messages"],
      [
        ...currentMessages,
        {
          role: "user",
          content: "",
        },
      ]
    );

    trackEvent("prompt_chat_completion_message_created", {
      promptId,
    });
  };

  return (
    <Form.List name={["content", "messages"]}>
      {(fields, { add, remove }) => {
        if (fields.length === 0) {
          add();
        }

        const moveField = (fromIndex: number, toIndex: number) => {
          const currentMessages = form.getFieldValue(["content", "messages"]);

          // Use form.setFieldsValue to clear the form fields

          form.setFieldValue(["content", "messages"], []);

          const movedItem = currentMessages[fromIndex]; // Extract the item to move

          // Create a new array with the item moved to the new index
          const newArray = currentMessages.filter(
            (_, index) => index !== fromIndex
          );
          newArray.splice(toIndex, 0, movedItem);

          // Update the messages with the new array
          form.setFieldValue(["content", "messages"], newArray);
        };

        return (
          <div>
            <DndProvider backend={HTML5Backend}>
              {fields.map((field, index) => (
                <ChatMessage
                  key={field.key}
                  index={index}
                  canDelete={fields.length !== 1}
                  onMove={(dragIndex: number, hoverIndex: number) => {
                    moveField(dragIndex, hoverIndex);
                  }}
                  isOver={false}
                  onDelete={() => {
                    remove(index);
                    trackEvent("prompt_chat_completion_message_deleted", {
                      promptId,
                    });
                  }}
                />
              ))}
            </DndProvider>

            <Button icon={<PlusOutlined />} onClick={() => handleAdd()}>
              New Message
            </Button>
          </div>
        );
      }}
    </Form.List>
  );
};
