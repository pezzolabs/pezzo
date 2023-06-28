import { Injectable } from "@nestjs/common";
import { ReportRequestDto } from "./dto/report-request.dto";
import * as LLMToolkit from "@pezzo/llm-toolkit";
import { randomUUID } from "crypto";
import { OpenSearchService } from "../opensearch/opensearch.service";

@Injectable()
export class ReportingService {
  constructor(private openSearchService: OpenSearchService) {}

  async saveReport(
    dto: ReportRequestDto,
    ownership: {
      organizationId: string;
      projectId: string;
    }
  ) {
    const reportId = randomUUID();

    const { provider, type, properties, metadata, request, response } = dto;

    // TODO: split calculate costs logic
    const responseBody = (response as any).body;
    const usage = responseBody.usage;
    const requestBody = (request as any).body;
    const model = requestBody.model;
    const { promptCost, completionCost } =
      LLMToolkit.OpenAIToolkit.calculateGptCost({
        model,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
      });
    const calculated = {
      promptCost: parseFloat(promptCost.toFixed(6)),
      completionCost: parseFloat(completionCost.toFixed(6)),
      totalCost: parseFloat((promptCost + completionCost).toFixed(6)),
    };

    const result = await this.openSearchService.client.index({
      index: "requests",
      body: {
        ownership,
        reportId,
        calculated,
        provider,
        type,
        properties,
        metadata,
        request,
        response,
      },
    });

    return result;
  }
}
