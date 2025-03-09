import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { RequestReportFilterFields } from "./shared";

// Enum keys are read by GQL, which means they need to be lowercase
export enum SortOrder {
  asc = "asc",
  desc = "desc",
}
registerEnumType(SortOrder, {
  name: "SortOrder",
});

@InputType()
export class SortInput {
  @Field(() => String, { nullable: false })
  field: RequestReportFilterFields;

  @Field(() => SortOrder, { nullable: false })
  order: SortOrder;
}
