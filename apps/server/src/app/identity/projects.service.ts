import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { randomBytes } from "crypto";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(
    name: string,
    slug: string,
    organizationId: string,
    creatorUserId: string
  ) {
    const project = await this.prisma.project.create({
      data: {
        name,
        slug,
        organizationId,
        members: {
          create: {
            userId: creatorUserId,
          },
        },
      },
    });

    const projectApiKeyValue = `pez_${randomBytes(32).toString("hex")}`;
    await this.prisma.apiKey.create({
      data: {
        id: projectApiKeyValue,
        projectId: project.id,
      },
    });

    return project;
  }

  async getProjectById(id: string) {
    return this.prisma.project.findUnique({
      where: {
        id,
      },
    });
  }

  async getProjectsByOrgId(organizationId: string) {
    return this.prisma.project.findMany({
      where: {
        organizationId,
      },
    });
  }

  async getProjectBySlug(slug: string, organizationId: string) {
    return this.prisma.project.findFirst({
      where: {
        slug,
        organizationId,
      },
    });
  }

  async getProjectsByUser(userId: string) {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }
}
