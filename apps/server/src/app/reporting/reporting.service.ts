import { OpenSearchService } from "../opensearch/opensearch.service";
import { OpenSearchIndex } from "../opensearch/types";
import { Injectable } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { randomUUID } from "crypto";
import { buildRequestReport } from "./utils/build-request-report";
import { RequestReport } from "./object-types/request-report.model";
import { MAX_PAGE_SIZE } from "../../lib/pagination";
import { FilterInput } from "../common/filters/filter.input";
import { SortInput } from "../common/filters/sort.input";
import { mapFiltersToDql } from "./utils/dql-utils";
import { AnalyticsService } from "../analytics/analytics.service";

@Injectable()
export class ReportingService {
  constructor(
    private openSearchService: OpenSearchService,
    private analytics: AnalyticsService
  ) {}

  async saveReport(
    dto: CreateReportDto,
    ownership: {
      organizationId: string;
      projectId: string;
    },
    isTestPrompt = false,
  ): Promise<RequestReport> {
    const reportId = randomUUID();
    const { report, calculated } = buildRequestReport(dto);

    const { properties, metadata, request, response, cacheEnabled, cacheHit } =
      report;

    await this.openSearchService.client.index({
      index: OpenSearchIndex.Requests,
      body: {
        timestamp: request.timestamp,
        ownership,
        reportId,
        calculated,
        properties,
        metadata,
        request,
        response,
        cacheEnabled,
        cacheHit,
      },
    });

    this.analytics.trackEvent("request_reported", {
      organizationId: ownership.organizationId,
      projectId: ownership.projectId,
      reportId,
      isTestPrompt: isTestPrompt,
      promptId: dto.metadata.promptId as string,
      client: (dto.metadata.client as string) || null,
      clientVersion: (dto.metadata.clientVersion as string) || null,
      cacheEnabled,
    });

    return {
      reportId,
      calculated,
      properties,
      metadata: metadata as unknown as RequestReport["metadata"],
      request: request as any,
      response: response as any,
      cacheEnabled,
      cacheHit,
    };
  }

  async getReports({
    projectId,
    organizationId,
    page,
    size: pageSize,
    filters,
    sort,
  }: {
    projectId: string;
    organizationId: string;
    page: number;
    size: number;
    filters: FilterInput[];
    sort: SortInput;
  }) {
    const size = pageSize > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : pageSize;
    const from = (page - 1) * size;

    const dql = mapFiltersToDql({
      restrictions: {
        "ownership.projectId": projectId,
        "ownership.organizationId": organizationId,
      },
      sort,
      filters,
    });

    return this.openSearchService.client.search<{
      hits: {
        hits: Array<{ _source: RequestReport }>;
        total: { value: number };
      };
    }>({
      index: OpenSearchIndex.Requests,
      body: dql,
      size,
      from,
      track_total_hits: true,
    });
  }
}
