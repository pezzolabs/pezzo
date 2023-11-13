import { BaseCallbackHandler } from "langchain/callbacks";
import { Serialized } from "langchain/load/serializable";
import { BaseMessage, LLMResult } from "langchain/schema";
import { Pezzo, ReportData } from "@pezzo/client";

const MESSAGE_TYPE_TO_ROLE = {
  human: "user",
  system: "system",
  ai: "assistant",
};

const LC_PROVIDER_TO_PEZZO_PROVIDER = {
  // TODO: Get this from @pezzo/types.
  openai: "OpenAI",
};

interface LLmStartExtraParams {
  invocation_params: {
    model: string;
    top_p: number;
    max_tokens: number;
    temperature: number;
    presence_penalty: number;
    frequency_penalty: number;
  };
  [key: string]: unknown;
}

interface LLmError {
  error: {
    message: string;
    type: string;
    param: unknown;
    context: unknown;
  };
  headers: {
    date: string;
    [key: string]: unknown;
  };
  status: number;
}

export class PezzoCallbackHandler extends BaseCallbackHandler {
  terminated = false;
  pezzo: Pezzo;
  name = "PezzoCallbackHandler";
  logRecords: Record<string, Partial<ReportData>>;

  constructor(pezzoClient: Pezzo) {
    super();
    this.pezzo = pezzoClient;
    this.logRecords = {};
  }

  override async handleChatModelStart(
    llm: Serialized,
    messages: BaseMessage[][],
    runId: string,
    _parentRunId?: string,
    extraParams?: LLmStartExtraParams
  ) {
    const currentRunIdLog = this.logRecords[runId] ?? {};

    this.logRecords[runId] = {
      ...currentRunIdLog,
      metadata: {
        ...currentRunIdLog.metadata,
        provider: LC_PROVIDER_TO_PEZZO_PROVIDER[llm.id[2]],
        type: "",
        runId,
        environment: this.pezzo.options.environment,
      },
      request: {
        ...currentRunIdLog.request,
        timestamp: new Date().toISOString(),
        body: {
          messages: messages[0].map(this.getMessageFromDict),
          model: extraParams.invocation_params.model,
          top_p: extraParams.invocation_params.top_p,
          max_tokens: extraParams.invocation_params.max_tokens,
          temperature: extraParams.invocation_params.temperature,
          presence_penalty: extraParams.invocation_params.presence_penalty,
          frequency_penalty: extraParams.invocation_params.frequency_penalty,
        },
      },
    };
  }

  // TODO: Should we keep this?
  // override async handleLLMStart(
  //   llm: Serialized,
  //   prompts: string[],
  //   runId: string,
  //   parentRunId?: string,
  //   extraParams?: Record<string, unknown>,
  //   tags?: string[],
  //   metadata?: Record<string, unknown>,
  //   name?: string
  // ) {
  //   console.log("===========[LLMStart]===========");
  //   console.log("LLMStart");
  //   console.log("llm", llm);
  //   console.log("prompts", prompts);
  //   console.log("runId", runId);
  //   console.log("extraParams", extraParams);
  //   console.log("============================================");
  //
  //   const [, , provider, model] = llm.id;
  //   console.debug("Provider", provider);
  //   console.debug("Model", model);
  //
  //   const merged = `${provider}/${model}`;
  //
  //   switch (merged) {
  //     case "openai/ChatOpenAI":
  //       console.log("support");
  //       break;
  //     default:
  //       console.debug(
  //         `${provider} ${model} monitoring is not currently supoprted by Pezzo, skipping...`
  //       );
  //       this.terminated = true;
  //       break;
  //   }
  // }

  override handleLLMError(error: LLmError, runId: string) {
    const currentRunIdLog = this.getCurrentRunIdLog(runId);

    this.logRecords[runId] = {
      ...currentRunIdLog,
      response: {
        timestamp: new Date().toISOString(),
        body: error.error,
        status: error.status,
      },
    };

    void this.reportPromptExecution(runId);
  }

  override async handleLLMEnd(output: LLMResult, runId: string) {
    if (this.terminated) {
      return;
    }

    const { llmOutput, generations } = output;
    const currentRunIdLog = this.getCurrentRunIdLog(runId);

    console.log(JSON.stringify(llmOutput, null, 2));

    this.logRecords[runId] = {
      ...currentRunIdLog,
      response: {
        ...currentRunIdLog.response,
        timestamp: new Date().toISOString(),
        body: {
          id: "",
          object: "",
          created: "",
          model: "",
          choices: generations[0].map((generation, index) => ({
            index,
            // @ts-expect-error -- property "message" exists on the type.
            message: this.getMessageFromDict(generation.message),
            finish_reason: generation.generationInfo["finish_reason"],
          })),
          usage: {
            prompt_tokens: llmOutput["tokenUsage"]["promptTokens"],
            completion_tokens: llmOutput["tokenUsage"]["completionTokens"],
            total_tokens: llmOutput["tokenUsage"]["totalTokens"],
          },
          system_fingerprint: null,
        },
        status: 200,
      },
    };

    void this.reportPromptExecution(runId);
  }

  private async reportPromptExecution(runId: string) {
    try {
      await this.pezzo.reportPromptExecution(
        this.logRecords[runId] as ReportData
      );
      delete this.logRecords[runId];
    } catch (error) {
      console.error(
        `Error reporting prompt execution for run id ${runId}`,
        error
      );
    }
  }

  private getMessageFromDict(message: BaseMessage): {
    role: keyof typeof MESSAGE_TYPE_TO_ROLE;
    content: string;
  } {
    const messageDict = message.toDict();
    return {
      role: MESSAGE_TYPE_TO_ROLE[messageDict.type],
      content: messageDict.data.content,
    };
  }

  private getCurrentRunIdLog(runId: string): Partial<ReportData> {
    const currentRunIdLog = this.logRecords[runId];
    if (!currentRunIdLog?.request) {
      throw new Error(`No log was initiated from run id ${runId}}`);
    }

    return currentRunIdLog;
  }
}
