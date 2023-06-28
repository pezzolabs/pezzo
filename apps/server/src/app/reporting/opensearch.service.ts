import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Client } from "@opensearch-project/opensearch";
import { ProviderType, ReportRequestDto } from "./dto/report-request.dto";
import * as LLMToolkit from "@pezzo/llm-toolkit";
import { randomUUID } from "crypto";
import { ConfigService } from "@nestjs/config";

export enum OpenSearchIndex {
  Requests = "requests",
}

@Injectable()
export class OpenSearchService {
  private readonly os: Client;

  constructor(private config: ConfigService) {
    this.os = new Client({
      node: this.config.get("OPENSEARCH_URL"),
    });
  }

  async saveReport(
    dto: ReportRequestDto,
    ownership: {
      organizationId: string;
      projectId: string;
    }
  ) {
    const reportId = randomUUID();

    //TODO: add AI21 support
    if (dto.provider !== ProviderType.OpenAI) {
      throw new InternalServerErrorException("Unsupported provider");
    }

    const { provider, type, properties, metadata, request, response } =
      dto as ReportRequestDto<ProviderType.OpenAI>;

    // TODO: split calculate costs logic
    const responseBody = response.body;
    const usage = responseBody.usage;
    const requestBody = request.body;
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

    return await this.os.index({
      index: OpenSearchIndex.Requests,
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
  }
}
