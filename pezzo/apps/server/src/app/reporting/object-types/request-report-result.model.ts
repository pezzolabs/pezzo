import { Field, ObjectType } from "@nestjs/graphql";
import { Pagination } from "../../../lib/pagination";
import { GraphQLJSONObject } from "graphql-type-json";
import { SerializedPaginatedReport, SerializedReport } from "pezzo/libs/types/src";

@ObjectType()
export class PaginatedReportsResult {
  @Field(() => [GraphQLJSONObject], { nullable: false })
  data: SerializedPaginatedReport[];

  @Field(() => Pagination, { nullable: false })
  pagination: Pagination;
}

@ObjectType()
export class ReportResult {
  @Field(() => GraphQLJSONObject, { nullable: false })
  data: SerializedReport;
}
