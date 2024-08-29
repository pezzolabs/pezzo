import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { randomUUID } from "crypto";
import { buildRequestReport } from "./utils/build-request-report";
import { MAX_PAGE_SIZE } from "../../lib/pagination";
import {
  FilterInput,
  getSQLOperatorByFilterOperator,
} from "../common/filters/filter.input";
import { SortInput } from "../common/filters/sort.input";
import { ClickHouseService } from "../clickhouse/clickhouse.service";
import {
  PaginatedReportsSchema,
  ReportSchema,
  SerializedReport, serializeGaiReport,
  serializePaginatedReport,
  serializeReport, TestPromptRequest, TestPromptResponse,
} from "@pezzo/types";
import { PaginatedReportsResult } from "./object-types/request-report-result.model";
import {GetPromptCompletionResult} from "@pezzo/client";
import moment from "moment";

@Injectable()
export class ReportingService {
  constructor(private clickHouseService: ClickHouseService) {}

  async saveReport(
    dto: CreateReportDto,
    ownership: {
      organizationId: string;
      projectId: string;
    },
    isTestPrompt = false
  ): Promise<SerializedReport> {
    const reportId = randomUUID();
    const { report, calculated } = buildRequestReport(dto);

    const { metadata, request, response, cacheEnabled, cacheHit } = report;

    const reportToSave: ReportSchema = {
      id: reportId,
      timestamp: request.timestamp,
      organizationId: ownership.organizationId,
      projectId: ownership.projectId,
      promptCost: (calculated as any).promptCost,
      completionCost: (calculated as any).completionCost,
      totalCost: (calculated as any).totalCost,
      promptTokens: (calculated as any).promptTokens,
      completionTokens: (calculated as any).completionTokens,
      totalTokens: (calculated as any).totalTokens,
      duration: (calculated as any).duration,
      environment: isTestPrompt ? "PLAYGROUND" : metadata.environment,
      client: metadata.client,
      clientVersion: metadata.clientVersion,
      model: request.body.model,
      provider: metadata.provider,
      modelAuthor: "openai",
      type: "ChatCompletion",
      requestTimestamp: request.timestamp,
      requestBody: JSON.stringify(request.body),
      isError: (response as any).status !== 200,
      responseStatusCode: (response as any).status,
      responseTimestamp: response.timestamp,
      responseBody: JSON.stringify(response.body),
      cacheEnabled: cacheEnabled,
      cacheHit: cacheHit,
      promptId: report.metadata.promptId || null,
    };

    try {
      await this.clickHouseService.client.insert({
        format: "JSONEachRow",
        table: "reports",
        values: [reportToSave],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Could not save report`);
    }

    return serializeReport(reportToSave);
  }

  async saveGaiPlatformReport(
    dto: GetPromptCompletionResult,
    ownership: {
      organizationId: string;
      projectId: string;
    },
    isTestPrompt = false,
    request: {
      promptId: string
      model: string
      prompt: any
      variables: any
      system_hint: any
      temperature: number
      max_tokens: number
      extra: any
    }
  ): Promise<SerializedReport> {
    const reportId = randomUUID();

    const requestObject: TestPromptRequest = {
      content: {
        prompt: request.prompt,
        variables: request.variables,
        messages: [
          {
            content: request.system_hint,
            role: "user",
            extra: request.extra
          }
        ],
        model: request.model,
        temperature: request.temperature,
        max_tokens: request.max_tokens
      }
    };

    const responseObject: TestPromptResponse = {
      data: dto.completion
    };

    console.log("requestTimestamp: " + dto.requestTimestamp);
    console.log("responseTimestamp: " + dto.responseTimestamp);

    const reportToSave: ReportSchema = {
      id: reportId,
      timestamp: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      organizationId: ownership.organizationId,
      projectId: ownership.projectId,
      promptCost: 0,
      completionCost: 0,
      totalCost: 0,
      promptTokens: dto.prompt_tokens,
      completionTokens: dto.completion_tokens,
      totalTokens: (dto.prompt_tokens + dto.completion_tokens),
      duration: dto.responseTimestamp.getTime() - dto.requestTimestamp.getTime(),
      environment: "PLAYGROUND",
      client: "gai-platform-api",
      clientVersion: "3",
      model: dto.model,
      provider: "GAI Platform",
      modelAuthor: "GAI Platform",
      type: "ChatCompletion",
      requestTimestamp: moment(dto.requestTimestamp).format("YYYY-MM-DD HH:mm:ss"),
      requestBody: JSON.stringify(requestObject),
      isError: dto.isError || false,
      responseStatusCode: dto.isError ? 400 : 200,
      responseTimestamp: moment(dto.responseTimestamp).format("YYYY-MM-DD HH:mm:ss"),
      responseBody: JSON.stringify(responseObject),
      cacheEnabled: false,
      cacheHit: false,
      promptId: request.promptId,
    };

    try {
      await this.clickHouseService.client.insert({
        format: "JSONEachRow",
        table: "reports",
        values: [reportToSave],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Could not save report`);
    }

    return serializeReport(reportToSave);
  }

  async getReportById(
    reportId: string,
    projectId: string
  ): Promise<SerializedReport> {
    const rows = await this.clickHouseService.knex
      .select<ReportSchema[]>("*")
      .from("reports")
      .where({
        id: reportId,
        projectId,
      })
      .limit(1);

    const result = serializeReport(rows[0]);
    return result;
  }

  async getReports({
    projectId,
    offset,
    limit,
    filters = [],
    sort,
  }: {
    projectId: string;
    offset: number;
    limit: number;
    filters: FilterInput[];
    sort: SortInput;
  }): Promise<PaginatedReportsResult> {
    const size = limit > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : limit;
    const from = offset > 0 ? offset : 0;

    const knex = this.clickHouseService.knex;

    let totalRowsQuery = knex
      .select(knex.raw("COUNT() as total"))
      .from("reports")
      .where("projectId", projectId)
      .first();

    let query = knex
      .select<PaginatedReportsSchema[]>({
        id: "id",
        environment: "environment",
        timestamp: "timestamp",
        responseStatusCode: "responseStatusCode",
        model: "model",
        modelAuthor: "modelAuthor",
        provider: "provider",
        duration: "duration",
        totalTokens: "totalTokens",
        totalCost: "totalCost",
        cacheEnabled: "cacheEnabled",
        cacheHit: "cacheHit",
      })
      .from("reports");

    query = query.where("projectId", "=", projectId);

    for (const filter of filters) {
      try {
        const operator = getSQLOperatorByFilterOperator(filter.operator);
        let field = filter.field;
        let value = filter.value;

        if (filter.field === ("timestamp" as any)) {
          const d = new Date(value as string).toISOString();
          value = knex.raw(`parseDateTimeBestEffort('${d}')`) as any;
        }

        if (filter.operator === "like") {
          field = knex.raw(`lower(${filter.field})`) as any;
          value = (value as string).toLowerCase();
        }

        query = query.where(field, operator, value);
        totalRowsQuery = totalRowsQuery.where(field, operator, value);
      } catch (error) {
        throw new BadRequestException(
          `Invalid filter operator ${filter.operator}`
        );
      }
    }

    query = query.limit(size).offset(offset);

    if (sort) {
      query.orderBy(sort.field, sort.order);
    } else {
      query.orderBy("timestamp", "desc");
    }

    try {
      const result = await query;
      const totalRowsResult = await totalRowsQuery;

      return {
        data: result.map((report) => serializePaginatedReport(report)),
        pagination: {
          offset: from,
          limit,
          total: totalRowsResult.total,
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Could not get reports`);
    }
  }
}
