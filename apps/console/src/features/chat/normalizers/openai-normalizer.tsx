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
import { InlineCodeSnippet } from "~/components/common/InlineCodeSnippet";

const baseIconCn = cn(
  "w-10 h-10 flex items-center justify-center rounded-sm border"
);

export const getIcon = (role: OpenAI.ChatCompletionRole) => {
  switch (role) {
    case "user":
      return (
        <div className={cn(baseIconCn, "bg-purple-500")}>
          <UserIcon className="h-6 w-6 text-white" />
        </div>
      );
    case "assistant":
      return (
        <div className={cn(baseIconCn, "bg-emerald-500")}>
          <BotIcon className="h-6 w-6 text-white" />
        </div>
      );
    case "system":
      return (
        <div className={cn(baseIconCn, "bg-stone-500")}>
          <WrenchIcon className="h-6 w-6 text-white" />
        </div>
      );
  }
};

const renderFunctionCall = (message: OpenAI.Chat.ChatCompletionMessage) => {
  const function_call = {
    ...message.function_call,
    arguments: JSON.parse(message.function_call.arguments),
  };

  return (
    <div className="w-[100%]">
      <p className="mb-2 font-semibold">Function call:</p>
      <pre className="w-full overflow-y-auto rounded-md border p-4">
        {JSON.stringify(function_call, null, 2)}
      </pre>
    </div>
  );
};

export const normalizeOpenAIChatResponse = (
  request: OpenAI.Chat.CompletionCreateParams,
  response: OpenAI.Chat.ChatCompletion
): Chat => {
  const messages: ChatMessage[] = [];

  console.log("request", request);

  // First, populate messages from the request
  request.messages.forEach((message) => {
    if (Array.isArray(message.content)) {
      const subMessages: SubChatMessage[] = [];
      const contentParts = message.content;

      contentParts.forEach((contentPart) => {
        const { type } = contentPart;

        if (type === "text") {
          subMessages.push({
            icon: (
              <div className={cn(baseIconCn, "h-8 w-8", "bg-purple-500")}>
                <TypeIcon className="h-5 w-5 text-white" />
              </div>
            ),
            label: "text",
            content: contentPart.text,
          });
        } else if (type === "image_url") {
          subMessages.push({
            icon: (
              <div className={cn(baseIconCn, "h-8 w-8", "bg-purple-500")}>
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
            ),
            label: "image",
            content: (
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Detail:</span>
                  <InlineCodeSnippet>
                    {contentPart.image_url.detail}
                  </InlineCodeSnippet>
                </div>
                <img src={contentPart.image_url.url} alt="Report" />
              </div>
            ),
          });
        }
      });

      messages.push({
        icon: getIcon(message.role),
        role: message.role,
        subMessages,
        content: "",
      });
    } else {
      messages.push({
        icon: getIcon(message.role),
        role: message.role,
        content: message.content as string, // TODO: support vision model
      });
    }
  });

  // Then, populate response messages
  response.choices.forEach((choice) => {
    if (choice.message.function_call) {
      messages.push({
        icon: getIcon(choice.message.role),
        role: choice.message.role,
        content: renderFunctionCall(choice.message),
      });
    } else {
      messages.push({
        icon: getIcon(choice.message.role),
        role: choice.message.role,
        content: choice.message.content,
      });
    }
  });

  return {
    provider: Provider.OpenAI,
    messages,
  };
};
