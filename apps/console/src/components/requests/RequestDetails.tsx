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
  TabsTrigger,
  Button,
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
  Link,
  MessageSquare,
} from "lucide-react";
import { Tag } from "../common/Tag";
import { cn } from "@pezzo/ui/utils";
import { normalizeOpenAIChatResponse } from "~/features/chat/normalizers/openai-normalizer";
import { ChatView } from "~/features/chat/ChatView";
import { useCopyToClipboard } from "usehooks-ts";
import { ModelDetails } from "~/pages/requests/ModelDetails";
import { useReport } from "~/graphql/hooks/queries";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import OpenAI from "openai";
import {normalizeGAIChatResponse} from "~/features/chat/normalizers/gai-platform-normalizer";
import {GaiChatView} from "~/features/chat/GaiChatView";

type Mode = "chat" | "json";

interface Props {
  disableCopy?: boolean;
  id: string;
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
  const { projectId } = useCurrentProject();
  const disableCopy = props.disableCopy || false;
  const { report } = useReport(
    { projectId, reportId: props.id },
    { enabled: !!projectId && !!props.id }
  );

  const isSuccess = report.isError === false;
  const isError = report.isError === true;

  const [selectedMode, setSelectedMode] = useState<Mode>(
    isSuccess ? "chat" : "json"
  );

  const [copied, copy] = useCopyToClipboard();

  const handleDisplayModeChange = (mode: Mode) => {
    setSelectedMode(mode);
    trackEvent("prompt_test_display_mode_changed", { mode });
  };

  const clientString =
    report.client && report.clientVersion
      ? `${getClientDisplayName(report.client)} - v${report.clientVersion}`
      : "Unknown";

  const listData = [
    {
      title: "Request ID",
      description: report.id,
    },
    {
      title: "Cache",
      description: (
        <div className="flex gap-1">
          <Tag>{report.cacheEnabled ? "enabled" : "disabled"}</Tag>

          {report.cacheEnabled && <Tag>{report.cacheHit ? "hit" : "miss"}</Tag>}
        </div>
      ),
    },
    {
      title: "Client",
      description: clientString,
    },
    {
      title: "Provider",
      description: <div className="font-mono">{report.provider}</div>,
    },
    {
      title: "Model",
      description: (
        <ModelDetails model={report.model} modelAuthor={report.modelAuthor} />
      ),
    },
    {
      title: "Tokens",
      description: report.isError ? (
        "0"
      ) : (
        <div className="flex items-center gap-1">
          <span>{report.totalTokens}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CoinsIcon className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent side="left">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Prompt tokens:</span>
                    <span> {report.promptTokens}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Completion tokens:</span>{" "}
                    <span>{report.completionTokens}</span>
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
      description: `$${report?.totalCost?.toFixed(5) ?? 0}`,
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
              <span>{report.responseStatusCode} Error</span>
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
      description: report.environment,
    },
    {
      title: "Duration",
      description: ms(report.duration),
    },
  ];

  const renderResponse = () => {
    if (selectedMode === "json") {
      return (
        <RequestResponseViewJsonView
          requestBody={report.requestBody as OpenAI.ChatCompletionCreateParams}
          responseBody={report.responseBody as OpenAI.ChatCompletion}
        />
      );
    }

    // const chat = normalizeGAIChatResponse(
    //   report.requestBody,
    //   report.responseBody
    // );
    // const chat = {
    //   request: report.requestBody.content.provider,
    //   response: report.responseBody.data
    // }
    return <GaiChatView request={report.requestBody.content.messages.prompt} response={report.responseBody.data} />;
  };

  return (
    <div className=" text-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h3>Request Details</h3>

        {!disableCopy && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                copy(window.location.href);
              }}
            >
              {!copied && (
                <>
                  <Link className="mr-2 h-4 w-4" /> Copy Link
                </>
              )}

              {copied && (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" /> Copied
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="px-4">
        {report.environment === "PLAYGROUND" && (
          <Alert className="my-4 border-blue-900 bg-blue-950/40 text-blue-500">
            <AlertDescription className="flex items-center gap-1">
              <InfoIcon className="h-4 w-4" />
              This is a test request from the GAI Platform
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-1">
          {listData.map((item) => (
            <div
              key={item.title}
              className="flex h-12 items-center justify-between border-b py-3"
            >
              <div className="font-semibold">{item.title}</div>
              <div>{item.description}</div>
            </div>
          ))}

          <div className="mt-2">
            <div className="mb-3 flex items-center justify-center">
              <Tabs
                value={selectedMode}
                onValueChange={(value: Mode) => handleDisplayModeChange(value)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    disabled={!isSuccess}
                    className="flex gap-1"
                    value="chat"
                  >
                    <MessageSquare className="h-4 w-4" /> Chat
                  </TabsTrigger>
                  <TabsTrigger className="flex gap-1" value="json">
                    <BracesIcon className="h-4 w-4" /> JSON
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {renderResponse()}
          </div>
        </div>
      </div>
    </div>
  );
};
