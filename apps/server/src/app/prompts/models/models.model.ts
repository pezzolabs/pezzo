import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Models {

  @Field(() => [String], {nullable:true})
  models: string[];

  @Field(() => String, {nullable:false})
  gai_req_id: string;
}
