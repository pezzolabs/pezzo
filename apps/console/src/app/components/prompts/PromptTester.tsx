import { PromptExecutionStatus } from "@prisma/client";
import {
  Button,
  Col,
  Descriptions,
  Drawer,
  Form,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import styled from "@emotion/styled";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { PromptVariables } from "./PromptVariables";
import { PromptEditor } from "./PromptEditor";
import { useEffect, useState } from "react";
import { usePromptTester } from "../../lib/providers/PromptTesterContext";
import { isJson } from "../../lib/utils/is-json";

const StyledPre = styled.pre`
  white-space: pre-wrap;
  background: #000;
  padding: 20px;
  border-radius: 6px;
`;

const { Item } = Descriptions;

export const PromptTester = () => {
  const {
    isTesterOpen,
    closeTester,
    testResult: result,
    isTestInProgress,
    runTest,
  } = usePromptTester();
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [form] = Form.useForm();

  useEffect(() => {
    if (result?.variables) {
      setVariables(result.variables);
    }
  }, [result]);

  const handleRerunTest = () => {
    const { content, settings } = form.getFieldsValue(true);
    runTest({
      content,
      settings,
      variables,
    });
  };

  return (
    <Drawer
      size="large"
      open={isTesterOpen}
      onClose={() => closeTester()}
      title={
        <Row gutter={[12, 12]}>
          <Col span={12}>Prompt Test Result</Col>
          <Col
            span={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Space wrap>
              <Button
                type="primary"
                onClick={handleRerunTest}
                loading={isTestInProgress}
                icon={<RedoOutlined />}
              >
                Re-run Prompt
              </Button>
            </Space>
          </Col>
        </Row>
      }
      width="80%"
    >
      {result && (
        <Form
          form={form}
          initialValues={{
            content: result.content,
            settings: result.settings,
          }}
        >
          <div>
            <Typography.Title level={3}>Stats</Typography.Title>
            <Descriptions
              size="small"
              column={1}
              bordered
              style={{ marginBottom: 14, width: 400 }}
            >
              {result.status && (
                <>
                  <Item label="Status">
                    {result.status === PromptExecutionStatus.Success ? (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        Success
                      </Tag>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        Error
                      </Tag>
                    )}
                  </Item>
                  <Item label="Duration">
                    {Math.ceil(result.duration / 1000)} seconds
                  </Item>
                  <Item label="Total Cost">${result.totalCost}</Item>
                  <Item label="Prompt Cost">${result.promptCost}</Item>
                  <Item label="Completion Cost">${result.completionCost}</Item>
                  <Item label="Total Tokens">{result.totalTokens}</Item>
                  <Item label="Prompt Tokens">{result.promptTokens}</Item>
                  <Item label="Completion Tokens">
                    {result.completionTokens}
                  </Item>
                </>
              )}
            </Descriptions>

            <Typography.Title level={3}>Variables</Typography.Title>
            <PromptVariables
              variables={variables}
              onVariableChange={(key, value) =>
                setVariables({ ...variables, [key]: value })
              }
            />

            <div style={{ marginTop: 20 }}>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Typography.Title level={3}>Request</Typography.Title>
                  <div style={{ background: "#000000", padding: 10 }}>
                    <PromptEditor value={result.interpolatedContent} />
                  </div>
                </Col>
                <Col span={12}>
                  {result.status === PromptExecutionStatus.Success ? (
                    <>
                      <Typography.Title level={3}>Result</Typography.Title>
                      <StyledPre>
                        {isJson(result.result)
                          ? JSON.stringify(JSON.parse(result.result), null, 2)
                          : result.result}
                      </StyledPre>{" "}
                    </>
                  ) : (
                    <>
                      <Typography.Title level={3}>Error</Typography.Title>
                      <StyledPre>{result.error}</StyledPre>
                    </>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      )}
    </Drawer>
  );
};
