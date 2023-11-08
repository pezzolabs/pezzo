import { BaseCallbackHandler } from "langchain/callbacks";
import { Serialized } from "langchain/load/serializable";
import {
  AgentAction,
  AgentFinish,
  BaseMessage,
  ChainValues,
  LLMResult,
} from "langchain/schema";
import { Pezzo } from "@pezzo/client";

export class PezzoCallbackHandler extends BaseCallbackHandler {
  terminated = false;
  pezzo: Pezzo;
  name = "PezzoCallbackHandler";

  constructor(pezzoClient: Pezzo) {
    super();
    this.pezzo = pezzoClient;
  }

  override async handleChatModelStart(llm: Serialized, messages: BaseMessage[][], runId: string, parentRunId?: string, extraParams?: Record<string, unknown>, tags?: string[], metadata?: Record<string, unknown>, name?: string) {
    console.log("===========[ChatModelStart]===========");
    console.log("ChatModelStart");
    console.log("llm", llm);
    console.log("messages", messages);
    console.log("runId", runId);
    console.log("extraParams", extraParams);
    console.log("============================================");
  }

  override async handleLLMStart(llm: Serialized, prompts: string[], runId: string, parentRunId?: string, extraParams?: Record<string, unknown>, tags?: string[], metadata?: Record<string, unknown>, name?: string) {
    console.log("===========[LLMStart]===========");
    console.log("LLMStart");
    console.log("llm", llm);
    console.log("prompts", prompts);
    console.log("runId", runId);
    console.log("extraParams", extraParams);
    console.log("============================================");

    const [, , provider, model] = llm.id;
    console.debug("Provider", provider);
    console.debug("Model", model);

    const merged = `${provider}/${model}`;

    switch (merged) {
      case "openai/ChatOpenAI":
        console.log("support");
        break;
      default:
        console.debug(`${provider} ${model} monitoring is not currently supoprted by Pezzo, skipping...`);
        this.terminated = true;
        break;
    }
  }

  override async handleLLMEnd(
    output: LLMResult,
    runId: string,
    parentRunId?: string | undefined,
    tags?: string[] | undefined
  ) {
    if (this.terminated) {
      return;
    }

    console.log("===========[LLMEnd]===========");
    console.log("runId", runId);
    console.log("output", JSON.stringify(output, null, 2));
    console.log("============================================");
  }
}
