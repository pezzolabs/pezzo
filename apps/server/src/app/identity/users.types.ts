import { OrgRole } from "@prisma/client";

export interface RequestUser {
  id: string;
  email: string;
  orgMemberships: {
    organizationId: string;
    role: OrgRole;
    memberSince: Date;
  }[]
}