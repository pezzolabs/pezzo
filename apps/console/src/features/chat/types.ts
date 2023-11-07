import { Provider } from "@pezzo/types";

export type ChatMessage = {
  icon: string | React.ReactNode;
  role: "user" | "assistant" | "function" | "system";
  content: string | React.ReactNode;
}

export type Chat = {
  provider: Provider;
  messages: ChatMessage[];
}