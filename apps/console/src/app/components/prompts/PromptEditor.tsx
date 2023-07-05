import { Button, Card, Col, Form, FormInstance, Row, Select } from "antd";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { PromptEditFormInputs } from "../../lib/hooks/usePromptEdit";
import { DeleteOutlined } from "@ant-design/icons";

interface Props {
  value?: string;
  form: FormInstance<PromptEditFormInputs>;
  onDeleteMessage?: () => void;
  onChange?: (value: string) => void;
}

export const PromptEditor = ({ form, onDeleteMessage }: Props) => {
  const settings = form.getFieldValue("settings");
  const [messages, setMessages] = useState<{ role: "user" | "assistant" }[]>(
    []
  );

  useEffect(() => {
    if (messages.length) return;
    const settings = form.getFieldValue("settings");
    const initialMessages = settings.messages.map(({ role }) => ({
      role,
    }));
    setMessages(initialMessages.length ? initialMessages : [{ role: "user" }]);
  }, [form, messages]);

  const handleDeleteMessage = () => {
    setMessages((prev) => prev.slice(0, prev.length - 1));
    form.setFieldValue(
      ["settings", "messages"],
      settings.messages.slice(0, settings.messages.length - 1)
    );
    onDeleteMessage?.();
  };

  return (
    <Card>
      <Row>
        <Col span={24}>
          {messages.map((_, index) => (
            <Card
              key={index}
              style={{ margin: 12 }}
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Form.Item
                    name={["settings", "messages", index, "role"]}
                    initialValue={
                      settings.messages[index]?.role == null
                        ? "user"
                        : undefined
                    }
                    style={{
                      width: index > 0 ? "50%" : "100%",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Select
                      options={[
                        {
                          label: "User",
                          value: "user",
                        },
                        {
                          label: "Assistant",
                          value: "assistant",
                        },
                      ]}
                      bordered={false}
                    />
                  </Form.Item>
                  {index > 0 && (
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={handleDeleteMessage}
                    />
                  )}
                </div>
              }
            >
              <Form.Item
                key={index}
                name={["settings", "messages", index, "content"]}
              >
                <TextArea
                  styles={{
                    textarea: {
                      color: "#fff",
                    },
                  }}
                  style={{
                    resize: "none",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    color: "#fff",
                  }}
                  rows={5}
                  bordered={false}
                  color="#fff"
                />
              </Form.Item>
            </Card>
          ))}
          <Button
            onClick={() => setMessages((prev) => [...prev, { role: "user" }])}
            disabled={!settings.messages[messages.length - 1]?.content?.length}
          >
            + New Message
          </Button>
        </Col>
      </Row>
    </Card>
  );
  //     <Row>
  //       <Col span={10}>
  //         <Form.Item
  //           name={["settings", "messages", 0, "content"]}
  //           label="System"
  //         >
  //           <Card>
  //             <CodeMirror
  //               onChange={onChange}
  //               placeholder="You are a tax accountant."
  //               className={css`
  //                 .cm-content {
  //                   white-space: pre-wrap !important;
  //                 }
  //                 .cm-selectionBackground {
  //                   background: ${colors.slate["400"]} !important;
  //                 }
  //               `}
  //               basicSetup={{
  //                 lineNumbers: false,
  //                 foldGutter: false,
  //                 autocompletion: false,
  //                 crosshairCursor: false,
  //                 highlightActiveLine: false,
  //                 highlightSelectionMatches: false,
  //               }}
  //               extensions={[]}
  //               theme={materialInit({
  //                 settings: {
  //                   fontFamily: "Roboto Mono",
  //                   lineHighlight: "red",
  //                   background: "transparent",
  //                 },
  //               })}
  //               value={value}
  //               height="350px"
  //             />
  //           </Card>
  //         </Form.Item>
  //       </Col>
  //       <Col span={13} offset={1}>
  //         {messages.map((message, index) => (
  //           <Form.Item
  //             key={index}
  //             name={["settings", "messages", index + 1, "content"]}
  //             label={message.type}
  //             style={{
  //               textTransform: "capitalize",
  //             }}
  //           >
  //             <Card>
  //               <CodeMirror
  //                 onChange={onChange}
  //                 placeholder="I need help to file my taxes."
  //                 className={css`
  //                   .cm-content {
  //                     white-space: pre-wrap !important;
  //                   }
  //                   .cm-selectionBackground {
  //                     background: ${colors.slate["400"]} !important;
  //                   }
  //                 `}
  //                 basicSetup={{
  //                   lineNumbers: false,
  //                   foldGutter: false,
  //                   autocompletion: false,
  //                   crosshairCursor: false,
  //                   highlightActiveLine: false,
  //                   highlightSelectionMatches: false,
  //                 }}
  //                 extensions={[]}
  //                 theme={materialInit({
  //                   settings: {
  //                     fontFamily: "Roboto Mono",
  //                     lineHighlight: "red",
  //                     background: "transparent",
  //                   },
  //                 })}
  //                 value={value}
  //                 height="150px"
  //               />
  //             </Card>
  //           </Form.Item>
  //         ))}
  //         <Button
  //           onClick={() => setMessages((prev) => [...prev, { type: "user" }])}
  //         >
  //           + New Message
  //         </Button>
  //       </Col>
  //     </Row>
  //   </Card>
  // );
};
