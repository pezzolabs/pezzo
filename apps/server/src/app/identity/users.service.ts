import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { User } from "@prisma/client";
import { UserCreateRequest } from "./users.types";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userCreateRequest: UserCreateRequest): Promise<User> {
    const [user] = await this.prisma.$transaction([
      this.prisma.user.create({
        data: {
          id: userCreateRequest.id,
          email: userCreateRequest.email,
        },
        include: {
          orgMemberships: true,
        },
      }),
      this.prisma.organization.create({
        data: {
          name: "Default Organization",
          members: {
            create: {
              userId: userCreateRequest.id,
            },
          },
        },
      }),
    ]);

    return user;
  }

  async getUser(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { orgMemberships: true },
    });

    return user;
  }

  async getUserOrgMemberships(email: string) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: {
        user: {
          email,
        },
      },
    });
    return memberships;
  }
}
