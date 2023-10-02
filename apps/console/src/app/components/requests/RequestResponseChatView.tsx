import { UserCircleIcon } from "@heroicons/react/24/solid";
import Icon from "@ant-design/icons/lib/components/Icon";
import {
  ObservabilityRequest,
  ObservabilityResponse,
  Provider,
} from "@pezzo/types";
import {
  Space,
  Typography,
  theme,
  List,
  Row,
  Col,
  Avatar,
  Tag,
  Tooltip,
  Card,
} from "antd";
import OpenAILogo from "../../../assets/providers/openai-logo.svg";

interface Props {
  request: ObservabilityRequest<Provider.OpenAI>;
  response: ObservabilityResponse<Provider.OpenAI>;
}

export const RequestResponseChatView = ({ request, response }: Props) => {
  const { token } = theme.useToken();

  const choices = response.body.choices ?? [];

  const renderAvatar = (role: "user" | "system" | "assistant") => {
    switch (role) {
      case "user":
        return (
          <Avatar
            shape="circle"
            src={<Icon component={() => <UserCircleIcon width={"100%"} />} />}
          />
        );
      case "system":
        return <Avatar shape="circle">S</Avatar>;
      case "assistant":
        return (
          <Avatar
            shape="square"
            src={
              <img
                alt="OpenAI logo"
                style={{
                  backgroundColor: "rgb(25, 195, 125)",
                  color: "#fff",
                  padding: 4,
                }}
                src={OpenAILogo}
              />
            }
          />
        );
    }
  };

  const renderMessage = (message, index) => {
    const isFunctionResponse = !!message.function_call;

    if (isFunctionResponse) {
      return (
        <>
          <Typography.Title level={5}>
            Function Call: {message.function_call.name}
          </Typography.Title>
          <Tag>{message.function_call.arguments}</Tag>
        </>
      );
    }

    return (
      <Row>
        <List.Item
          style={{
            background: token.colorBorderBg,
            borderTop:
              index % 1 === 0 && index > 0
                ? `1px solid ${token.colorBorder}`
                : "none",

            borderTopLeftRadius: index > 0 ? 0 : 8,
            borderTopRightRadius: index > 0 ? 0 : 8,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            padding: 12,
            width: "100%",
          }}
        >
          <Col span={3}>
            <Tooltip
              title={
                <span style={{ textTransform: "capitalize" }}>
                  {message.role}
                </span>
              }
            >
              {renderAvatar(message.role)}
            </Tooltip>
          </Col>
          <Col>
            <Typography.Text>{message.content}</Typography.Text>
          </Col>
        </List.Item>
      </Row>
    );
  };

  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
        border: `1px solid ${token.colorBorder}`,
        borderRadius: 8,
        margin: 0,
      }}
    >
      <List
        dataSource={[
          ...request.body.messages,
          ...choices.map((choice) => choice.message),
        ]}
        renderItem={(item, index) => renderMessage(item, index)}
      />
      <Typography.Text strong>Response</Typography.Text>
      <Card>
        <pre>{JSON.stringify(response.body, null, 2)}</pre>
      </Card>
    </Space>
  );
};
