import { OrgRole } from "@prisma/client";
import { User } from "../../@generated/user/user.model";
import { Field, ObjectType } from "@nestjs/graphql";
export interface RequestUser {
  id: string;
  email: string;
  orgMemberships: {
    organizationId: string;
    role: OrgRole;
    memberSince: Date;
  }[];
  projects: {
    id: string;
  }[];
}

export interface UserCreateRequest {
  id: string;
  email: string;
}

@ObjectType()
export class ExtendedUser extends User {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  photoUrl: string;

  @Field(() => [String])
  organizationIds: string[];
}
