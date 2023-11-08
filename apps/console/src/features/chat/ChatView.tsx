import { Chat } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pezzo/ui";

type Props = {
  chat: Chat;
};

export const ChatView = ({ chat }: Props) => {
  return (
    <div>
      <p className="mb-4 font-semibold">Chat</p>
      <div className="rounded-md border">
        {chat.messages.map((message, index) => (
          <div className="flex items-center gap-4 p-4 first:rounded-t-md last:rounded-b-md odd:bg-black">
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
            <div className="flex-1">{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
