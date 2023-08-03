import {
  ObservabilityReportMetadata,
  ObservabilityRequest,
  ObservabilityResponse,
  Provider,
  ObservabilityReportProperties,
} from "@pezzo/types";
import {
  List,
  Space,
  Tag,
  Tooltip,
  Typography,
  Segmented,
  Card,
  Alert,
} from "antd";
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
import { trackEvent } from "../../lib/utils/analytics";

type Mode = "chat" | "json";

interface Props {
  id: string;
  request: ObservabilityRequest;
  response: ObservabilityResponse;
  provider: Provider;
  metadata: ObservabilityReportMetadata;
  properties: ObservabilityReportProperties;
  calculated: Record<string, any>;
}

export const RequestDetails = (props: Props) => {
  const request = props.request as ObservabilityRequest<Provider.OpenAI>;
  const response = props.response as ObservabilityResponse<Provider.OpenAI>;
  const isSuccess = response.status >= 200 && response.status < 300;

  const [selectedMode, setSelectedMode] = useState<Mode>(
    isSuccess ? "chat" : "json"
  );

  const handleDisplayModeChange = (mode: Mode) => {
    setSelectedMode(mode);
    trackEvent("prompt_test_display_mode_changed", { mode });
  };

  if (props.provider !== Provider.OpenAI) {
    return null;
  }

  const listData = [
    {
      title: "Provider",
      description: <Tag>{props.provider}</Tag>,
    },
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
                Completion tokens: {response.body.usage?.completion_tokens}
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
      description: isSuccess ? (
        <Tag color="green">Success</Tag>
      ) : (
        <Tag color="red">{response.status} Error</Tag>
      ),
    },
    {
      title: "Duration",
      description: ms(props.calculated.duration),
    },
    {
      title: "Properties",
      description: props.properties ? (
        <Card size="small">
          <pre>{JSON.stringify(props.properties, null, 2)}</pre>
        </Card>
      ) : (
        <Typography.Text italic type="secondary">
          No properties specified
        </Typography.Text>
      ),
    },
    {
      title: "Display mode",
      description: (
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
          onChange={handleDisplayModeChange}
        />
      ),
    },
  ];

  return (
    <div>
      {props.metadata?.isTestPrompt && (
        <Alert
          type="info"
          showIcon
          message="This is a test request from the Pezzo platform"
        />
      )}
      <List
        style={{ borderBottom: "1px solid rgba(253, 253, 253, 0.12)" }}
        dataSource={listData}
        renderItem={(item) => (
          <List.Item style={{ alignItems: "flex-start" }}>
            <List.Item.Meta title={item.title} />
            <div>{item.description}</div>
          </List.Item>
        )}
      />
      <br />
      {selectedMode === "json" && (
        <RequestResponseViewJsonView request={request} response={response} />
      )}
      {selectedMode === "chat" && (
        <RequestResponseChatView request={request} response={response} />
      )}
    </div>
  );
};
