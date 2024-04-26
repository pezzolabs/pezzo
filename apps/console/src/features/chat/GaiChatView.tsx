import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pezzo/ui";
import {cn} from "@pezzo/ui/utils";
import {BotIcon, UserIcon} from "lucide-react";

interface Props {
  request: string;
  response: string;
}

export const GaiChatView = (props: Props) => {

  const baseIconCn = cn(
    "w-10 h-10 flex items-center justify-center rounded-sm border"
  );

  const getUserIcon = () => {
    return (
      <div className={cn(baseIconCn, "bg-purple-500")}>
        <UserIcon className="h-6 w-6 text-white"/>
      </div>
    );
  };

  const getBotIcon = () => {
    return (
      <div className={cn(baseIconCn, "bg-emerald-500")}>
        <BotIcon className="h-6 w-6 text-white"/>
      </div>
    );
  }


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
                <TooltipTrigger>{getUserIcon()}</TooltipTrigger>
                <TooltipContent className="capitalize">
                  request
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
                <TooltipTrigger>{getBotIcon()}</TooltipTrigger>
                <TooltipContent className="capitalize">
                  response
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