import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pezzo/ui";
import {cn} from "@pezzo/ui/utils";
import {BotIcon, UserIcon, WrenchIcon,PencilIcon} from "lucide-react";

interface Props {
  request_prompt: string;
  request_prompt_variable: string;
  request_system_hint: string;
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

  const getVariableIcon = () => {
    return (
      <div className={cn(baseIconCn, "bg-sky-500")}>
        <PencilIcon className="h-6 w-6 text-white"/>
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

  const getSystemIcon = () => {
    return (
      <div className={cn(baseIconCn, "bg-stone-500")}>
        <WrenchIcon className="h-6 w-6 text-white"/>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border mb-4">
        <div
          key={"1"}
          className="flex gap-4 p-4 first:rounded-t-md last:rounded-b-md odd:bg-black mt-2"
        >
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{getUserIcon()}</TooltipTrigger>
                <TooltipContent className="capitalize">
                  request - prompt template
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1">
            {props.request_prompt}
          </div>
        </div>
        <div
          key={"2"}
          className="flex gap-4 p-4 first:rounded-t-md last:rounded-b-md odd:bg-black mt-2"
        >
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{getVariableIcon()}</TooltipTrigger>
                <TooltipContent className="capitalize">
                  request - prompt variable
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1">
            {props.request_prompt_variable}
          </div>
        </div>
        <div
          key={"3"}
          className="flex gap-4 p-4 first:rounded-t-md last:rounded-b-md odd:bg-black"
        >
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{getSystemIcon()}</TooltipTrigger>
                <TooltipContent className="capitalize">
                  request - system hint
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1">
            {props.request_system_hint}
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <div
          key={"1"}
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
