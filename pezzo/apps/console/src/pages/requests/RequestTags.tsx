import { cn } from "pezzo/libs/ui/src/utils";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "pezzo/libs/ui/src";
import { RequestReportItem } from "./types";
import { AlertTriangleIcon, BugPlayIcon, ZapIcon } from "lucide-react";

export const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => (
  <TooltipProvider>
    <ShadcnTooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </ShadcnTooltip>
  </TooltipProvider>
);

export const RequestItemTags = ({
  request,
}: {
  request: RequestReportItem;
}) => {
  const { isTestPrompt, promptId, cacheHit } = request;
  const tags = [];

  const baseCn = "rounded-sm border p-1 text-xs flex gap-1 items-center h-6";

  if (!promptId) {
    tags.push(
      <Tooltip text="This prompt is not managed by Pezzo">
        <div className={cn(baseCn, "border-0 text-yellow-500")}>
          <AlertTriangleIcon className="h-3 w-3" />
        </div>
      </Tooltip>
    );
  }

  if (isTestPrompt) {
    tags.push(
      <Tooltip text="This prompt was executed via the Prompt Editor">
        <div
          className={cn(baseCn, "border-blue-900 bg-blue-950 text-blue-500")}
        >
          <BugPlayIcon className="h-3 w-3" />
          Test
        </div>
      </Tooltip>
    );
  }

  if (cacheHit) {
    tags.push(
      <Tooltip text="This prompt was served from cache cache">
        <div
          className={cn(baseCn, "border-green-900 bg-green-950 text-green-500")}
        >
          <ZapIcon className="h-3 w-3" />
          Cache
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="flex pr-2 text-muted-foreground">
      <div className="flex gap-1">
        {tags.map((tag, i) => (
          <div key={i}>{tag}</div>
        ))}
      </div>
    </div>
  );
};
