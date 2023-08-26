import { ObjectType, Field } from "@nestjs/graphql";
import { AllPrimitiveTypes } from "../../../lib/ts-helpers";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType()
export class RequestReport {
  @Field(() => String, { nullable: false })
  reportId!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  calculated!: Record<string, AllPrimitiveTypes>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  properties!: Record<string, AllPrimitiveTypes>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata!: Record<string, AllPrimitiveTypes>;

  @Field(() => GraphQLJSONObject, { nullable: false })
  request!: Record<string, AllPrimitiveTypes>;

  @Field(() => GraphQLJSONObject, { nullable: false })
  response!: Record<string, AllPrimitiveTypes>;

  @Field(() => Boolean, { nullable: true })
  cacheEnabled?: boolean = false;

  @Field(() => Boolean, { nullable: true })
  cacheHit?: boolean = null;
}
