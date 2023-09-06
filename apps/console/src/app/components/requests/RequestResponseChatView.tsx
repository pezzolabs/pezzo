import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  ObservabilityRequest,
  ObservabilityResponse,
  Provider,
} from "@pezzo/types";
import { Space, Typography, theme, List, Row, Col, Avatar, Tag } from "antd";
import OpenAILogo from "../../../assets/providers/openai-logo.svg";

interface Props {
  request: ObservabilityRequest<Provider.OpenAI>;
  response: ObservabilityResponse<Provider.OpenAI>;
}

export const RequestResponseChatView = ({ request, response }: Props) => {
  const { token } = theme.useToken();

  const choices = response.body.choices ?? [];

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
        renderItem={(item, index) => {
          const isFunctionResponse = !!item.function_call;
          return item.role === "user" ? (
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
                  <Avatar shape="square" src={<UserCircleIcon />} />
                </Col>
                <Col>
                  <Typography.Text>{item.content}</Typography.Text>
                </Col>
              </List.Item>
            </Row>
          ) : (
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
                </Col>
                <Col>
                  {isFunctionResponse ? (
                    <>
                      <Typography.Title level={5}>
                        Function Call: {item.function_call.name}
                      </Typography.Title>
                      <Tag>{item.function_call.arguments}</Tag>
                    </>
                  ) : (
                    <Typography.Text>{item.content}</Typography.Text>
                  )}
                </Col>
              </List.Item>
            </Row>
          );
        }}
      />
    </Space>
  );
};
