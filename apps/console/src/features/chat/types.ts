import { Provider } from "@pezzo/types";
import OpenAI from "openai";

export type ChatMessage = {
  icon: string | React.ReactNode;
  role: OpenAI.ChatCompletionRole;
  content: string | React.ReactNode;
  subMessages?: SubChatMessage[];
};

export type SubChatMessage = {
  icon: string | React.ReactNode;
  label: "text" | "image";
  content: string | React.ReactNode;
};

export type Chat = {
  provider: Provider;
  messages: ChatMessage[];
};
