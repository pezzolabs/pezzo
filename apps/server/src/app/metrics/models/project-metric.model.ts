import { Field } from "@nestjs/graphql";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProjectMetric {
  @Field(() => Number, { nullable: false })
  currentValue: number;

  @Field(() => Number, { nullable: false })
  previousValue: number;
}
