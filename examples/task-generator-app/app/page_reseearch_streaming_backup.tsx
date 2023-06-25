"use client";

import { Alert, Button, Card, Form, Input, Layout, Typography } from "antd";
const { Content } = Layout;
import { useState } from "react";
import { Footer } from "antd/es/layout/layout";
import { useCompletion } from "ai/react";

interface FormInputs {
  document: string;
  question: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { completion, complete, input, stop, handleInputChange, handleSubmit } =
    useCompletion({ api: "/api/research" });
  // const { messages, append } = useChat({ api: "/api/research" });

  const handleFormFinish = async (values: FormInputs) => {
    setError(null);
    setIsLoading(true);
    try {
      // append({ role: "user", content: values.question });
      complete(values.question);
    } catch (error) {
      setError((error as any).response.data.message);
    }
    setIsLoading(false);
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
        <Card
          style={{
            marginTop: 30,
            borderRadius: 20,
            boxShadow: "2px 2px 10px -7px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={1} style={{ marginBottom: 0 }}>
              AI Researcher 🔎
            </Typography.Title>
            <Typography.Title
              level={2}
              style={{ marginTop: 20, fontSize: 20, fontWeight: 400 }}
            >
              The limitless AI researcher
            </Typography.Title>
          </div>

          <hr style={{ marginTop: 20, marginBottom: 20, opacity: 0.2 }} />

          {error && (
            <Alert
              style={{ width: 500, margin: "auto", marginBottom: 20 }}
              type="error"
              message={error}
              showIcon
              closable
            />
          )}

          <Typography.Paragraph style={{ textAlign: "center" }}>
            Provide a document, ask a question, and I'll find the answer!
          </Typography.Paragraph>

          <Form
            layout="vertical"
            style={{ width: 500, margin: "auto" }}
            autoComplete="off"
            onFinish={handleFormFinish}
          >
            <Form.Item
              name="document"
              label="Document"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Input placeholder="Paste a chunk of text here" />
            </Form.Item>
            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Input placeholder="Question about your text here" />
            </Form.Item>
            <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Ask Question
              </Button>
            </Form.Item>
          </Form>

          {completion}
          {/* {messages.map((m) => (
            <div key={m.id}>{m.content}</div>
          ))} */}
        </Card>
        <Footer>
          <Typography.Paragraph style={{ opacity: 0.5, textAlign: "center" }}>
            Made with ❤️ by{" "}
            <a href="https://pezzo.ai" target="_blank">
              Pezzo
            </a>
          </Typography.Paragraph>
        </Footer>
      </Content>
    </div>
  );
}
