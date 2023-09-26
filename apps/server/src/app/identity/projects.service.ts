import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PinoLogger } from "../logger/pino-logger";
import { EnvironmentsService } from "./environments.service";
import { UpdateProjectSettingsInput } from "./inputs/update-project-settings.input";

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private environmentsService: EnvironmentsService,
    private logger: PinoLogger
  ) {}

  async createProject(name: string, slug: string, organizationId: string) {
    this.logger.info("Creating project in database");
    const project = await this.prisma.project.create({
      data: {
        name,
        slug,
        organizationId,
      },
    });

    // Create default environment
    await this.environmentsService.createEnvironment("Production", project.id);

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
      include: {
        organization: true,
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

  async deleteProject(id: string) {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }

  async updateProjectSettings(data: UpdateProjectSettingsInput) {
    const { projectId, name } = data;
    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name,
      },
    });
  }
}
