import OpenAI from "openai";
import { Chat, ChatMessage, SubChatMessage } from "../types";
import { Provider } from "@pezzo/types";
import { cn } from "@pezzo/ui/utils";
import {
  BotIcon,
  ImageIcon,
  TypeIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";

const baseIconCn = cn(
  "w-10 h-10 flex items-center justify-center rounded-sm border"
);

export const getIcon = () => {
  return (
    <div className={cn(baseIconCn, "bg-purple-500")}>
      <UserIcon className="h-6 w-6 text-white" />
    </div>
  );
};

export const normalizeGAIChatResponse = (
  request: Record<string, any>,
  response: Record<string, any>
): Chat => {
  const messages: ChatMessage[] = [];

  // First, populate messages from the request

  // messages.push({
  //   icon: getIcon(),
  //   role: "user",
  //   content: request.content as string, // TODO: support vision model
  // });

  request.content.messages.forEach((req) => {
      messages.push({
        icon: getIcon(),
        role: "user",
        content: req.prompt as string, // TODO: support vision model
      });
  });

  // Then, populate response messages
  messages.push({
    icon: getIcon(),
    role: "user",
    content: response.data,
  });
  // response.forEach((res) => {
  //     messages.push({
  //       icon: getIcon(),
  //       role: "user",
  //       content: res.data,
  //     });
  // });

  return {
    provider: Provider.GAI,
    messages,
  };
};
