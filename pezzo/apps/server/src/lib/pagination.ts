import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Pagination {
  @Field(() => Number, { nullable: false })
  total: number;

  @Field(() => Number, { nullable: false })
  offset: number;

  @Field(() => Number, { nullable: false })
  limit: number;
}

export const MAX_PAGE_SIZE = 100;
