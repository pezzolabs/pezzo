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
          name: userCreateRequest.name,
          photoUrl: userCreateRequest.photoUrl,
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

  async updateUser(user: UserCreateRequest) {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        photoUrl: user.photoUrl,
      },
    });

    console.log(updatedUser.name);

    return updatedUser;
  }

  async getUserOrgMemberships(userId: string) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
    });
    return memberships;
  }
}
