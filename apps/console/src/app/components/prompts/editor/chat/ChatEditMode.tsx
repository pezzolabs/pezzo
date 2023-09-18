import { Button, Form } from "antd";
import { ChatMessage } from "./ChatMessage";
import { PlusOutlined } from "@ant-design/icons";
import { usePromptVersionEditorContext } from "../../../../lib/providers/PromptVersionEditorContext";
import { trackEvent } from "../../../../lib/utils/analytics";
import { useCurrentPrompt } from "../../../../lib/providers/CurrentPromptContext";
import { useEffect } from "react";
import { findVariables } from "../../../../lib/utils/find-variables";

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

        return (
          <div>
            {fields.map((field, index) => {
              return (
                <ChatMessage
                  key={field.key}
                  index={index}
                  canDelete={fields.length !== 1}
                  onDelete={() => {
                    remove(index);
                    trackEvent("prompt_chat_completion_message_deleted", {
                      promptId,
                    });
                  }}
                />
              );
            })}

            <Button icon={<PlusOutlined />} onClick={() => handleAdd()}>
              New Message
            </Button>
          </div>
        );
      }}
    </Form.List>
  );
};
