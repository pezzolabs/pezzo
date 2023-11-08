import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { HumanMessage, SystemMessage } from "langchain/schema";

import { PezzoCallbackHandler } from "../PezzoCallbackHandler";
import { Pezzo } from "@pezzo/client";

const pezzo = new Pezzo({
  environment: "Production",
});

const chatModel = new ChatOpenAI({
  temperature: 0,
  callbacks: [new PezzoCallbackHandler(pezzo)],
});

async function main() {
  const result = await chatModel.predictMessages([
    new SystemMessage("You must strictly response with uppercase letters"),
    new HumanMessage("What is the capital of france?"),
  ]);

  console.log(result);

  await wait_seconds(1);
}

main();

async function wait_seconds(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}
