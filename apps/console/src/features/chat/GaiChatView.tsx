import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pezzo/ui";
import {cn} from "@pezzo/ui/utils";
import {UserIcon} from "lucide-react";

interface Props {
  request: string;
  response: string;
}

export const GaiChatView = (props: Props) => {

  const baseIconCn = cn(
    "w-10 h-10 flex items-center justify-center rounded-sm border"
  );

  const getIcon = () => {
    return (
      <div className={cn(baseIconCn, "bg-purple-500")}>
        <UserIcon className="h-6 w-6 text-white" />
      </div>
    );
  };

  return (
    <div>
      <div className="rounded-md border">
        <div
          key={'1'}
          className="flex gap-4 p-4 first:rounded-t-md last:rounded-b-md odd:bg-black"
        >
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{getIcon()}</TooltipTrigger>
                <TooltipContent className="capitalize">
                  user
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1">
            {props.request}
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <div
          key={'1'}
          className="flex gap-4 p-4 first:rounded-t-md last:rounded-b-md odd:bg-black"
        >
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{getIcon()}</TooltipTrigger>
                <TooltipContent className="capitalize">
                  user
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1">
            {props.response}
          </div>
        </div>
      </div>
    </div>
  );
};
