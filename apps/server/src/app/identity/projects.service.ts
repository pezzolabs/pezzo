import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PinoLogger } from "../logger/pino-logger";
import { EnvironmentsService } from "./environments.service";

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private environmentsService: EnvironmentsService,
    private logger: PinoLogger
  ) {}

  async createProject(
    name: string,
    slug: string,
    organizationId: string,
    creatorUserId: string
  ) {
    this.logger.info("Creating project in database");
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

    // Create default environment
    await this.environmentsService.createEnvironment("Development", project.id);

    this.logger
      .assign({ projectId: project.id })
      .info("Creating API key for project");

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

  async getProjectsByUser(email: string) {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: {
            user: {
              email,
            },
          },
        },
      },
    });
  }
}
