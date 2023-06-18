import { OrgRole } from "@pezzo/prisma-server";

export interface RequestUser {
  id: string;
  supertokensUserId: string;
  email: string;
  orgMemberships: {
    organizationId: string;
    role: OrgRole;
    memberSince: Date;
  }[];
}

export interface UserCreateRequest {
  id: string;
  email: string;
}
