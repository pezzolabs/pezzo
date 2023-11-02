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
import Icon from "@ant-design/icons/lib/components/Icon";
import { CheckIcon, CircleSlash } from "lucide-react";
import { cn } from "@pezzo/ui/utils";

type Mode = "chat" | "json";

interface Props {
  id: string;
  request: ObservabilityRequest;
  response: ObservabilityResponse;
  provider: Provider;
  metadata: ObservabilityReportMetadata;
  properties: ObservabilityReportProperties;
  calculated: Record<string, any>;
  cacheEnabled: boolean;
  cacheHit: boolean;
}

const getClientDisplayName = (client: string) => {
  switch (client) {
    case "pezzo-ts":
      return "TypeScript (Official)";
    case "pezzo-python":
      return "Python (Official)";
    default:
      return client;
  }
};

export const RequestDetails = (props: Props) => {
  const request = props.request as ObservabilityRequest<Provider.OpenAI>;
  const response = props.response as ObservabilityResponse<Provider.OpenAI>;
  const isSuccess = response.status >= 200 && response.status < 300;
  const isError = !isSuccess;

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

  const clientString =
    props.metadata.client && props.metadata.clientVersion
      ? `${getClientDisplayName(props.metadata.client)} - v${
          props.metadata.clientVersion
        }`
      : "Unknown";

  const listData = [
    {
      title: "Cache",
      description: (
        <>
          <Tag>{props.cacheEnabled ? "enabled" : "disabled"}</Tag>
          <Tag>{props.cacheHit ? "hit" : "miss"}</Tag>
        </>
      ),
    },
    {
      title: "Client",
      description: clientString,
    },
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
      description: (
        <div
          className={cn("flex gap-1 rounded-sm p-1 text-xs font-medium", {
            "text-red-500": isError,
            "text-green-500": !isError,
          })}
        >
          {isError ? (
            <>
              <CircleSlash className="h-4 w-4" />
              <span>Error</span>
            </>
          ) : (
            <>
              <CheckIcon className="h-4 w-4" />
              <span>Success</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Environment",
      description: props.metadata.environment,
    },
    {
      title: "Duration",
      description: ms(props.calculated.duration),
    },
    {
      title: "Display mode",
      description: (
        <Segmented
          options={[
            {
              icon: (
                <Icon
                  component={() => (
                    <ChatBubbleBottomCenterTextIcon width={15} />
                  )}
                />
              ),
              value: "chat",
              label: "Chat",
            },
            {
              icon: <Icon component={() => <CodeBracketIcon width={15} />} />,
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
    <>
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
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Text strong>Properties</Typography.Text>
        {props.properties ? (
          <Card size="small" style={{ maxWidth: "100%" }}>
            <pre>{JSON.stringify(props.properties, null, 2)}</pre>
          </Card>
        ) : (
          <Typography.Text italic type="secondary">
            No properties specified
          </Typography.Text>
        )}
      </Space>
      <br />
      <br />
      {selectedMode === "json" && (
        <RequestResponseViewJsonView request={request} response={response} />
      )}
      {selectedMode === "chat" && (
        <RequestResponseChatView request={request} response={response} />
      )}
    </>
  );
};
