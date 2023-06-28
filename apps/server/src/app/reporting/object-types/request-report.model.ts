import { Field, ObjectType } from "@nestjs/graphql";
import { AllPrimitiveTypes } from "../../../lib/ts-helpers"
import { ProviderType } from "../dto/report-request.dto";
import { GraphQLJSONObject } from "graphql-type-json";


@ObjectType()
export class RequestReport {
  @Field(() => String, { nullable: false })
  ownership!: string;

  @Field(() => String, { nullable: false })
  reportId!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  calculated!: Record<string, AllPrimitiveTypes>;

  @Field(() => String, { nullable: false })
  provider!: ProviderType;

  @Field(() => String, { nullable: false })
  type!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  properties!: Record<string, AllPrimitiveTypes>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata!: Record<string, AllPrimitiveTypes>;

  @Field(() => GraphQLJSONObject, { nullable: false })
  request!: Record<string, AllPrimitiveTypes>;

  @Field(() => GraphQLJSONObject, { nullable: false })
  response!: Record<string, AllPrimitiveTypes>;


}
