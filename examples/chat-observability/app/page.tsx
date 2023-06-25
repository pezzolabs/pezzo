"use client";

import { Button, Card, Form, Input, Layout } from "antd";
const { Content } = Layout;
import { useChat } from "ai/react";

interface FormInputs {
  goal: string;
  numTasks: number;
}

interface FormInputs {
  userMessage: string;
}

export default function Home() {
  const { messages, isLoading, append } =
    useChat({ body: { chatId: "12233" }});

  const handleFormFinish = async (values: FormInputs) => {
    const { userMessage } = values;
    append({ role: "user", content: userMessage });
  };

  return (
    <div style={{ background: "#f5f5f5", height: "100vh" }}>
      <Content
        style={{
          padding: "50px",
          width: "800px",
          margin: "auto",
        }}
      >
        {messages.map((message, index) => (
          <Card
            key={index}
            style={{
              marginTop: 30,
              borderRadius: 20,
              background: message.role === "user" ? "#e6f7ff" : "#f6f6f6",
            }}
          >
            <p>{message.content}</p>
          </Card>
        ))}

        <Card>
          <Form
            layout="vertical"
            style={{ width: 500, margin: "auto" }}
            autoComplete="off"
            onFinish={handleFormFinish}
          >
            <Form.Item
              name="userMessage"
              label="Write something"
              rules={[
                { required: true, message: "This field is required" },
                { max: 250, message: "Maximum 250 characters" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Send
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </div>
  );
}
