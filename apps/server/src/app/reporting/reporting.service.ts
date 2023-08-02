import { OpenSearchService } from "../opensearch/opensearch.service";
import { OpenSearchIndex } from "../opensearch/types";
import { Injectable } from "@nestjs/common";
import { ReportRequestDto } from "./dto/report-request.dto";
import { randomUUID } from "crypto";
import { buildRequestReport } from "./utils/build-request-report";
import { RequestReport } from "./object-types/request-report.model";
import { MAX_PAGE_SIZE } from "../../lib/pagination";
import { FilterInput } from "../common/filters/filter.input";
import { SortInput } from "../common/filters/sort.input";
import { mapFiltersToDql } from "./utils/dql-utils";

@Injectable()
export class ReportingService {
  constructor(private openSearchService: OpenSearchService) {}

  async saveReport(
    dto: ReportRequestDto,
    ownership: {
      organizationId: string;
      projectId: string;
    }
  ): Promise<RequestReport> {
    const reportId = randomUUID();
    const { report, calculated } = buildRequestReport(dto);

    const { properties, metadata, request, response } = report;

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
      },
    });

    return {
      reportId,
      calculated,
      properties,
      metadata,
      request: request as any,
      response: response as any,
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
