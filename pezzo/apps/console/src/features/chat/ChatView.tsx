import { Chat, SubChatMessage } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../libs/ui/src";

type Props = {
  chat: Chat;
};

export const ChatView = ({ chat }: Props) => {
  const renderSubMessages = (subMessages: SubChatMessage[]) => {
    return subMessages.map((subMessage, index) => {
      return (
        <div className="flex gap-4 border-b pb-3 last:border-b-0 last:pb-0">
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{subMessage.icon}</TooltipTrigger>
                <TooltipContent className="capitalize">
                  {subMessage.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1">{subMessage.content}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="rounded-md border">
        {chat.messages.map((message, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 first:rounded-t-md last:rounded-b-md odd:bg-black"
          >
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>{message.icon}</TooltipTrigger>
                  <TooltipContent className="capitalize">
                    {message.role}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex-1">
              {message.subMessages ? (
                <div className="flex flex-col gap-y-3 border-l pl-4">
                  {renderSubMessages(message.subMessages)}
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
