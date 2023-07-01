import { Field, InputType } from "@nestjs/graphql";
import { FilterInput } from "../../common/filters/filter.input";
import { SortInput } from "../../common/filters/sort.input";

@InputType()
export class GetRequestsInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => Number, { nullable: false })
  page: number;

  @Field(() => Number, { nullable: false, defaultValue: 10 })
  size: number;

  @Field(() => [FilterInput], { nullable: true })
  filters?: FilterInput[];

  @Field(() => SortInput, { nullable: true })
  sort?: SortInput;
}
