import { Field, ObjectType } from "@nestjs/graphql";
import { RequestReport } from "./request-report.model";
import { Pagination } from "../../../lib/pagination";
import { PaginationResult } from "../../../lib/ts-helpers";

@ObjectType()
export class RequestReportResult implements PaginationResult<RequestReport> {
  @Field(() => [RequestReport], { nullable: false })
  data: RequestReport[];

  @Field(() => Pagination, { nullable: false })
  pagination: Pagination;

}
