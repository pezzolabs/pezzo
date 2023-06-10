import { Resolver } from "@nestjs/graphql";
import { Organization } from "../../@generated/organization/organization.model";
import { PrismaService } from "../prisma.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";

@UseGuards(AuthGuard)
@Resolver(() => Organization)
export class OrganizationsResolver {
  constructor(private prisma: PrismaService) {}
}
