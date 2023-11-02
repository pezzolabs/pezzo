import {
  ObservabilityReportMetadata,
  ObservabilityRequest,
  ObservabilityResponse,
  Provider,
  ObservabilityReportProperties,
} from "@pezzo/types";
import {
  Alert,
  AlertDescription,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@pezzo/ui";
import ms from "ms";
import { useState } from "react";
import { RequestResponseViewJsonView } from "./RequestResponseViewJsonView";
import { trackEvent } from "~/lib/utils/analytics";
import {
  BracesIcon,
  CheckIcon,
  CircleSlash,
  CoinsIcon,
  InfoIcon,
  MessageSquare,
} from "lucide-react";
import { Tag } from "../common/Tag";
import { cn } from "@pezzo/ui/utils";
import { normalizeOpenAIChatResponse } from "~/features/chat/normalizers/openai-normalizer";
import { ChatView } from "~/features/chat/ChatView";

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
        <div className="flex gap-1">
          <Tag>{props.cacheEnabled ? "enabled" : "disabled"}</Tag>

          {props.cacheEnabled && <Tag>{props.cacheHit ? "hit" : "miss"}</Tag>}
        </div>
      ),
    },
    {
      title: "Client",
      description: clientString,
    },
    {
      title: "Provider",
      description: <>{props.provider}</>,
    },
    {
      title: "Model",
      description: <>{request.body.model}</>,
    },
    {
      title: "Tokens",
      description: (
        <div className="flex items-center gap-1">
          <span>{props.calculated.totalTokens}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CoinsIcon className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Completion tokens:</span>{" "}
                    <span>{response.body.usage?.completion_tokens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Prompt tokens:</span>
                    <span> {response.body.usage?.prompt_tokens}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      title: "Cost",
      description: `$${props.calculated?.totalCost?.toFixed(3) ?? 0}`,
    },
    {
      title: "Status",
      description: (
        <div
          className={cn(
            "flex items-center gap-1 rounded-sm p-1 text-xs font-medium",
            {
              "text-red-500": isError,
              "text-green-500": !isError,
            }
          )}
        >
          {isError ? (
            <>
              <CircleSlash className="h-4 w-4" />
              <span>{response.status} Error</span>
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
        <Tabs
          defaultValue="chat"
          onValueChange={(value: Mode) => setSelectedMode(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="flex gap-1" value="chat">
              <MessageSquare className="h-4 w-4" /> Chat
            </TabsTrigger>
            <TabsTrigger className="flex gap-1" value="json">
              <BracesIcon className="h-4 w-4" /> JSON
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ),
    },
  ];

  const renderResponse = () => {
    if (selectedMode === "json") {
      return (
        <RequestResponseViewJsonView request={request} response={response} />
      );
    }

    if (props.provider === Provider.OpenAI) {
      const chat = normalizeOpenAIChatResponse(request.body, response.body);
      return <ChatView chat={chat} />;
    }
  };

  return (
    <div className="text-sm">
      {props.metadata?.isTestPrompt && (
        <div className="p-4">
          <Alert className="border-blue-900 bg-blue-950/40 text-blue-500">
            <AlertDescription className="flex items-center gap-1">
              <InfoIcon className="h-4 w-4" />
              This is a test request from the Pezzo Console
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {listData.map((item) => (
          <div
            key={item.title}
            className="flex h-12 items-center justify-between border-b px-4 py-3"
          >
            <div className="font-semibold">{item.title}</div>
            <div>{item.description}</div>
          </div>
        ))}

        <div className="p-4">{renderResponse()}</div>
      </div>
    </div>
  );
};
