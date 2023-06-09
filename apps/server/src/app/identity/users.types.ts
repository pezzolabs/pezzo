import { OrgRole } from "@prisma/client";
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
