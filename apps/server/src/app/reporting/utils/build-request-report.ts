import { ProviderType, ReportRequestDto } from "../dto/report-request.dto";
import { OpenAIToolkit } from "@pezzo/llm-toolkit";

export const buildRequestReport = (dto: ReportRequestDto) => {

  switch (dto.provider) {
    case ProviderType.OpenAI:
      return buildOpenAIReport(dto);
    case ProviderType.AI21:
      return buildAI21Report(dto);
    default:
      throw new Error("Unsupported provider");
  };

};

const buildOpenAIReport = (dto: ReportRequestDto<ProviderType.OpenAI>) => {

  const { response, request } = dto;

  const responseBody = response.body;
  const usage = responseBody.usage;
  const requestBody = request.body;
  const model = requestBody.model;



  console.log(usage)
  const { promptCost, completionCost } =
    OpenAIToolkit.calculateGptCost({
      model,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
    });


  const calculated = {
    promptCost: parseFloat(promptCost.toFixed(6)),
    completionCost: parseFloat(completionCost.toFixed(6)),
    totalCost: parseFloat((promptCost + completionCost).toFixed(6)),
  };

  return {
    report: dto,
    calculated,
  };

};

const buildAI21Report = (dto: ReportRequestDto<ProviderType.AI21>) => {

  return {
    report: dto,
    calculated: {},
  }
};

