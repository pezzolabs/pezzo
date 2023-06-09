import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../../@generated/user/user.model";

@ObjectType()
export class ExtendedUser extends User {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  photoUrl: string;

  @Field(() => [String])
  organizationIds: string[];
}
