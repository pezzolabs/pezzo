import { Injectable } from "@nestjs/common";
import { Client } from "@opensearch-project/opensearch";
import { ReportRequestDto } from "./dto/report-request.dto";
import * as LLMToolkit from "@pezzo/llm-toolkit";
import { randomUUID } from "crypto";

@Injectable()
export class OpenSearchService {
  private readonly os: Client;

  constructor() {
    this.os = new Client({
      node: "http://localhost:9200",
      ssl: {},
    });

    this.createIndexes();
  }

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

    const result = await this.os.index({
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

  async createIndexes() {
    console.log("Creating indices");

    const index = "requests";

    try {
      await this.os.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              ownership: {
                properties: {
                  organizationId: {
                    type: "keyword",
                  },
                  projectId: {
                    type: "keyword",
                  },
                }
              },
              reportId: {
                type: "keyword",
              },
              provider: {
                type: "keyword",
              },
              type: {
                type: "keyword",
              },
              properties: {
                type: "object",
              },
              metadata: {
                type: "object",
              },
              calculated: {
                type: "object",
              },
              request: {
                properties: {
                  timestamp: {
                    type: "date",
                  },
                  body: {
                    type: "object",
                  },
                },
              },
              response: {
                properties: {
                  timestamp: {
                    type: "date",
                  },
                  body: {
                    type: "object",
                  },
                  status: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      const type = error.meta.body.error.type;

      if (type === "resource_already_exists_exception") {
        console.log("Index already exists");
        return;
      }

      console.error("Could not create index", error.meta.body);
    }
  }
}
