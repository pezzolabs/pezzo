import { Provider } from "@pezzo/types";
import OpenAI from "openai";

export type ChatMessage = {
  icon: string | React.ReactNode;
  role: OpenAI.ChatCompletionRole;
  content: string | React.ReactNode;
};

export type Chat = {
  provider: Provider;
  messages: ChatMessage[];
};
