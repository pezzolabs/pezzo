import OpenAI from "openai";
import { Chat, ChatMessage } from "../types";
import { Provider } from "@pezzo/types";
import { cn } from "@pezzo/ui/utils";
import { BotIcon, UserIcon, WrenchIcon } from "lucide-react";

export const getIcon = (role: OpenAI.Chat.ChatCompletionMessage["role"]) => {
  const baseCn = cn(
    "w-10 h-10 flex items-center justify-center rounded-sm border"
  );

  switch (role) {
    case "user":
      return (
        <div className={cn(baseCn, "bg-purple-500")}>
          <UserIcon className="h-6 w-6 text-white" />
        </div>
      );
    case "assistant":
      return (
        <div className={cn(baseCn, "bg-emerald-500")}>
          <BotIcon className="h-6 w-6 text-white" />
        </div>
      );
    case "system":
      return (
        <div className={cn(baseCn, "bg-stone-500")}>
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

  // First, populate messages from the request
  request.messages.forEach((message) => {
    messages.push({
      icon: getIcon(message.role),
      role: message.role,
      content: message.content,
    });
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
