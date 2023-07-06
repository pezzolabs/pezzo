import { ReportRequestDto } from "../dto/report-request.dto";
import { ProviderType } from "@pezzo/types";
import { OpenAIToolkit } from "@pezzo/llm-toolkit";

export const buildRequestReport = (dto: ReportRequestDto) => {
  const requestTimestamp = new Date(dto.request.timestamp);
  const responseTimestamp = new Date(dto.response.timestamp);
  const duration = responseTimestamp.getTime() - requestTimestamp.getTime();
  switch (dto.provider) {
    case ProviderType.OpenAi:
      return buildOpenAIReport(dto, duration);
    default:
      throw new Error("Unsupported provider");
  }
};

const buildOpenAIReport = (
  dto: ReportRequestDto<ProviderType.OpenAi>,
  requestDuration: number
) => {
  const { response, request } = dto;

  const responseBody = response.body;
  const usage = responseBody.usage;
  const requestBody = request.body;
  const model = requestBody.model;

  if (!usage || !requestBody || !model)
    return {
      report: dto,
      calculated: {
        duration: requestDuration,
      },
    };

  const { promptCost, completionCost } = OpenAIToolkit.calculateGptCost({
    model,
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
  });

  const totalTokens = usage.prompt_tokens + usage.completion_tokens;

  const calculated = {
    promptCost: parseFloat(promptCost.toFixed(6)),
    completionCost: parseFloat(completionCost.toFixed(6)),
    totalCost: parseFloat((promptCost + completionCost).toFixed(6)),
    totalTokens,
    duration: requestDuration,
  };

  return {
    report: dto,
    calculated,
  };
};
