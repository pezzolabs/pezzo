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
  name: string | null;
  photoUrl: string | null;
  email: string;
}
