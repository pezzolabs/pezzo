import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Pagination {
  @Field(() => Number, { nullable: false })
  total: number;

  @Field(() => Number, { nullable: false })
  page: number;

  @Field(() => Number, { nullable: false })
  size: number;
}
