import {
  ObservabilityReportMetadata,
  ObservabilityRequest,
  ObservabilityResponse,
  ProviderType,
  ObservabilityReportProperties,
} from "@pezzo/types";
import { List, Space, Tag, Tooltip, Typography, Segmented } from "antd";
import { toDollarSign } from "../../lib/utils/currency-utils";
import { InfoCircleFilled } from "@ant-design/icons";
import ms from "ms";
import {
  ChatBubbleBottomCenterTextIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { RequestResponseChatView } from "./RequestResponseChatView";
import { RequestResponseViewJsonView } from "./RequestResponseViewJsonView";

type Mode = "chat" | "json";

interface Props {
  id: string;
  request: ObservabilityRequest;
  response: ObservabilityResponse;
  provider: ProviderType;
  metadata: ObservabilityReportMetadata;
  properties: ObservabilityReportProperties;
  calculated: Record<string, any>;
}

export const RequestDetails = (props: Props) => {
  const [selectedMode, setSelectedMode] = useState<Mode>("chat");

  if (props.provider !== ProviderType.OpenAi) {
    return null;
  }

  const request = props.request as ObservabilityRequest<ProviderType.OpenAi>;
  const response = props.response as ObservabilityResponse<ProviderType.OpenAi>;

  return (
    <div>
      <List
        dataSource={[
          {
            title: "Model",
            description: <Tag>{request.body.model}</Tag>,
          },
          {
            title: "Tokens",
            description: (
              <Space direction="horizontal">
                <div>{props.calculated.totalTokens}</div>
                <Tooltip
                  title={
                    <>
                      Completion tokens:{" "}
                      {response.body.usage?.completion_tokens}
                      <br />
                      Prompt tokens: {response.body.usage?.prompt_tokens}
                    </>
                  }
                  overlayStyle={{ fontSize: 12 }}
                  placement="right"
                >
                  <InfoCircleFilled />
                </Tooltip>
              </Space>
            ),
          },

          {
            title: "Cost",
            description: toDollarSign(props.calculated.totalCost),
          },
          {
            title: "Status",
            description:
              response.status >= 200 && response.status < 300 ? (
                <Tag color="green">Success</Tag>
              ) : (
                <Tag color="red">{response.status} Error</Tag>
              ),
          },
          {
            title: "Latency",
            description: ms(props.calculated.duration),
          },
        ]}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} />
            <div>{item.description}</div>
          </List.Item>
        )}
      />
      <Space
        direction="horizontal"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Typography.Text strong>Chat</Typography.Text>
        <Segmented
          options={[
            {
              icon: <ChatBubbleBottomCenterTextIcon width={18} height={14} />,
              value: "chat",
              label: "Chat",
            },
            {
              icon: <CodeBracketIcon width={18} height={14} />,
              value: "json",
              label: "JSON",
            },
          ]}
          value={selectedMode}
          onChange={(value) => setSelectedMode(value as Mode)}
        />
      </Space>
      <br /> <br />
      {selectedMode === "json" && (
        <RequestResponseViewJsonView request={request} response={response} />
      )}
      {selectedMode === "chat" && (
        <RequestResponseChatView request={request} response={response} />
      )}
    </div>
  );
};
