import { Button, Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { ChatMessage } from "./ChatMessage";
import { PlusOutlined } from "@ant-design/icons";

export const ChatEditMode = () => {
  const [form] = Form.useForm();
  const [messageOrder, setMessageOrder] = useState<string[]>([]);

  const handleNewMessage = useCallback(() => {
    const id = uuid();
    setMessageOrder([...messageOrder, id]);
  }, [messageOrder]);

  const handleDeleteMessage = (id: string) => {
    setMessageOrder(messageOrder.filter((messageId) => messageId !== id));
  };

  useEffect(() => {
    if (messageOrder?.length > 0) {
      return;
    }
    handleNewMessage();
  }, [messageOrder, handleNewMessage]);

  return (
    <Form form={form}>
      {messageOrder?.map((messageId, index) => (
        <ChatMessage
          key={messageId}
          id={messageId}
          canDelete={index !== 0}
          onDelete={() => handleDeleteMessage(messageId)}
        />
      ))}
      <Button icon={<PlusOutlined />} onClick={handleNewMessage}>
        New Message
      </Button>
    </Form>
  );
};
