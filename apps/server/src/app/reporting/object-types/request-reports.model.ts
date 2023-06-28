import { Field } from "@nestjs/graphql";
import { ObjectType } from "@nestjs/graphql";
import { RequestReport } from "./request-report.model";

@ObjectType()
export class RequestReports {
  @Field(() => [RequestReport], { nullable: false })
  requests!: Array<RequestReport>;
}
