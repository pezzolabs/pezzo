import { ForbiddenException } from "@nestjs/common";
import { RequestUser } from "./users.types";
import { OrgRole } from "@pezzo/prisma-server";

export function isOrgMember(user: RequestUser, organizationId: string) {
  return !!user.orgMemberships.find((m) => m.organizationId === organizationId);
}

export function isOrgMemberOrThrow(user: RequestUser, organizationId: string) {
  if (!user.orgMemberships.find((m) => m.organizationId === organizationId)) {
    throw new ForbiddenException();
  }
}

export function isOrgAdmin(user: RequestUser, organizationId: string) {
  const membership = user.orgMemberships.find(
    (m) => m.organizationId === organizationId
  );
  return !!membership && membership.role === OrgRole.Admin;
}

export function isOrgAdminOrThrow(user: RequestUser, organizationId: string) {
  const membership = user.orgMemberships.find(
    (m) => m.organizationId === organizationId
  );

  if (!membership || membership.role !== OrgRole.Admin) {
    throw new ForbiddenException();
  }
}
