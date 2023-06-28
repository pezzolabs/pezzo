"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Layout,
  List,
  Typography,
} from "antd";
const { Content } = Layout;
import * as apiClient from "./lib/apiClient";
import { useState } from "react";
import { Footer } from "antd/es/layout/layout";

interface FormInputs {
  goal: string;
  numTasks: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<apiClient.TasksResult["tasks"] | null>(
    null
  );

  const handleFormFinish = async (values: FormInputs) => {
    setError(null);
    setTasks(null);
    setIsLoading(true);
    try {
      const { tasks } = await apiClient.generateTasks(
        values.goal,
        values.numTasks
      );
      setTasks(tasks);
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
              Taskly 🦾
            </Typography.Title>
            <Typography.Title
              level={2}
              style={{ marginTop: 20, fontSize: 20, fontWeight: 400 }}
            >
              The limitless AI task generator
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
            Let me know your goal and {`I'll`} generate you some tasks, so you can
            get started right away!
          </Typography.Paragraph>

          <Form
            layout="vertical"
            style={{ width: 500, margin: "auto" }}
            autoComplete="off"
            onFinish={handleFormFinish}
          >
            <Form.Item
              name="goal"
              label="Goal"
              rules={[
                { required: true, message: "This field is required" },
                { max: 250, message: "Maximum 250 characters" },
              ]}
            >
              <Input placeholder="e.g. Bathroom Renovation Project" />
            </Form.Item>
            <Form.Item
              name="numTasks"
              label="Number of tasks"
              initialValue={5}
              rules={[{ required: true, message: "This field is required" }]}
            >
              <InputNumber min={1} max={8} placeholder="1-4" />
            </Form.Item>
            <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Generate Tasks ⚡️
              </Button>
            </Form.Item>
          </Form>

          {tasks && (
            <>
              <hr style={{ marginTop: 20, marginBottom: 20, opacity: 0.2 }} />
              <>
                <Typography.Title level={3} style={{ textAlign: "center" }}>
                  Your Tasks
                </Typography.Title>
                <List
                  itemLayout="horizontal"
                  dataSource={tasks.map((task: string) => ({ task }))}
                  renderItem={(item, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                        avatar={
                          <>
                            <Checkbox />
                          </>
                        }
                        description={item.task}
                      />
                    </List.Item>
                  )}
                />
              </>
            </>
          )}
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
