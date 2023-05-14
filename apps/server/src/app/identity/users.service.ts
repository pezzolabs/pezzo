import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { User } from "@prisma/client";
import { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";
import { randomBytes } from "crypto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userInfo: SupertokensUser): Promise<User> {
    const [user, org] = await this.prisma.$transaction([
      this.prisma.user.create({
        data: {
          id: userInfo.id,
          email: userInfo.email,
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
              userId: userInfo.id,
            },
          },
        },
      }),
    ]);

    const key = `pez_${randomBytes(32).toString("hex")}`;
    await this.prisma.apiKey.create({
      data: {
        id: key,
        organizationId: org.id,
      },
    });
    return user;
  }

  async getOrCreateUser(userInfo: SupertokensUser): Promise<User> {
    console.log("userInfo", userInfo);
    const user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
      include: { orgMemberships: true },
    });

    console.log("foundUser", user);

    if (user) {
      return user;
    }

    return this.createUser(userInfo);
  }

  async getUserOrgMemberships(userId: string) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
    });
    return memberships;
  }
}
