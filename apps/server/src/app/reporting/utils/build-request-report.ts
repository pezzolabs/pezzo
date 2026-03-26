import { CreateReportDto } from "../dto/create-report.dto";
import { Provider } from "@pezzo/types";
import { OpenAIToolkit } from "@pezzo/llm-toolkit";

export const buildRequestReport = (dto: CreateReportDto) => {
  const requestTimestamp = new Date(dto.request.timestamp);
  const responseTimestamp = new Date(dto.response.timestamp);
  const duration = responseTimestamp.getTime() - requestTimestamp.getTime();
  switch (dto.metadata.provider) {
    case Provider.OpenAI:
      return buildOpenAIReport(dto, duration);
    case Provider.MiniMax:
      return buildMiniMaxReport(dto, duration);
    default:
      throw new Error("Unsupported provider");
  }
};

const buildOpenAIReport = (
  dto: CreateReportDto<Provider.OpenAI>,
  requestDuration: number
) => {
  const { response, request } = dto;

  const responseBody = response.body;
  const usage = responseBody.usage;
  const requestBody = request.body;
  const model = requestBody.model as string;

  if (!usage || !requestBody || !model)
    return {
      report: dto,
      calculated: {
        duration: requestDuration,
      },
    };

  const { promptCost, completionCost } = OpenAIToolkit.calculateGptCost({
    model: (model.startsWith("ft:gpt-3.5-turbo-0613")
      ? "ft:gpt-3.5-turbo-0613"
      : model) as any,
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
  });

  const totalTokens = usage.prompt_tokens + usage.completion_tokens;

  const calculated = {
    promptCost: parseFloat(promptCost.toFixed(6)),
    completionCost: parseFloat(completionCost.toFixed(6)),
    totalCost: parseFloat((promptCost + completionCost).toFixed(6)),
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens,
    duration: requestDuration,
  };

  return {
    report: dto,
    calculated,
  };
};

// MiniMax pricing per 1M tokens (USD)
const MINIMAX_PRICING: Record<
  string,
  { promptCostPer1M: number; completionCostPer1M: number }
> = {
  "MiniMax-M2.7": { promptCostPer1M: 1.5, completionCostPer1M: 5.5 },
  "MiniMax-M2.7-highspeed": { promptCostPer1M: 1.0, completionCostPer1M: 4.0 },
  "MiniMax-M2.5": { promptCostPer1M: 1.0, completionCostPer1M: 4.0 },
  "MiniMax-M2.5-highspeed": { promptCostPer1M: 0.5, completionCostPer1M: 2.0 },
};

const buildMiniMaxReport = (dto: CreateReportDto, requestDuration: number) => {
  const { response, request } = dto;

  const responseBody = response.body as any;
  const usage = responseBody?.usage;
  const requestBody = request.body as any;
  const model = requestBody?.model as string;

  if (!usage || !requestBody || !model)
    return {
      report: dto,
      calculated: {
        duration: requestDuration,
      },
    };

  const pricing = MINIMAX_PRICING[model] ?? {
    promptCostPer1M: 1.0,
    completionCostPer1M: 4.0,
  };

  const promptCost =
    (usage.prompt_tokens / 1_000_000) * pricing.promptCostPer1M;
  const completionCost =
    (usage.completion_tokens / 1_000_000) * pricing.completionCostPer1M;
  const totalTokens = usage.prompt_tokens + usage.completion_tokens;

  const calculated = {
    promptCost: parseFloat(promptCost.toFixed(6)),
    completionCost: parseFloat(completionCost.toFixed(6)),
    totalCost: parseFloat((promptCost + completionCost).toFixed(6)),
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens,
    duration: requestDuration,
  };

  return {
    report: dto,
    calculated,
  };
};
