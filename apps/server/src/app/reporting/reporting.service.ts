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
  constructor(private openSearchService: OpenSearchService) { }

  async saveReport(
    dto: ReportRequestDto,
    ownership: {
      organizationId: string;
      projectId: string;
    }
  ) {
    const reportId = randomUUID();
    const { report, calculated } = buildRequestReport(dto);

    const { provider, type, properties, metadata, request, response } = report;

    return this.openSearchService.client.index({
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

  async getReports({ projectId, page, size: pageSize }: { projectId: string, page: number, size: number }) {

    const from = (page - 1) * pageSize;
    const size = pageSize;
    return await this.openSearchService.client.search<{
      hits: { hits: Array<{ _source: RequestReport }> };
    }>({
      index: OpenSearchIndex.Requests,
      body: {
        query: {
          match: {
            "ownership.projectId": projectId,
          },
        },

      },
      size,
      from
    });
  }
}
