import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { FilterType, RequestReportFilterFields } from "./shared";

// Enum keys are read by GQL, which means they need to be lowercase
export enum SortDirection {
  asc = "asc",
  desc = "desc",
}
registerEnumType(SortDirection, {
  name: "SortDirection",
});

@InputType()
export class SortInput {
  @Field(() => FilterType, { nullable: false })
  type: FilterType.Sort;

  @Field(() => String, { nullable: false })
  field: RequestReportFilterFields;

  @Field(() => SortDirection, { nullable: false })
  direction: SortDirection;
}
