import { ObjectType, Field } from "@nestjs/graphql";
import { AllPrimitiveTypes } from "../../../lib/ts-helpers";
import { ObservabilityRequestDto, ProviderType, ObservabilityResponseDto, ObservabilityReportMetadata, ObservabilityReportProperties } from "../dto/report-request.dto";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType()
export class RequestReport<
  TProviderType extends ProviderType | unknown = unknown
> {
  @Field(() => String, { nullable: false })
  reportId!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  calculated!: Record<string, AllPrimitiveTypes>;

  @Field(() => String, { nullable: false })
  provider!: string;

  @Field(() => String, { nullable: false })
  type!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  properties!: ObservabilityReportProperties;

  @Field(() => ObservabilityRequestDto, { nullable: true })
  metadata!: ObservabilityReportMetadata;

  @Field(() => GraphQLJSONObject, { nullable: false })
  request!: ObservabilityRequestDto<TProviderType>

  @Field(() => ObservabilityResponseDto, { nullable: false })
  response!: ObservabilityResponseDto<TProviderType>;
}
