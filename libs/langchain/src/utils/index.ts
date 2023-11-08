import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  FunctionMessage,
  AIMessage,
} from "langchain/schema";

import OpenAI from "openai";

export function covertLangChainChatMessagesToOpenAIMessages(messages: BaseMessag[]): OpenAI.Chat.ChatCompletionMessage[] {
  const openAIMessages: OpenAI.Chat.ChatCompletionMessage[] = [];

  for (const message of messages) {
    console.log("message", message);
  }

  return openAIMessages;
}

function covertLangChainChatMessageToOpenAIMessage(message: BaseMessage): OpenAI.Chat.ChatCompletionMessage {

}