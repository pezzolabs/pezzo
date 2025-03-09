import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class EnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEnvironment(name: string, projectId: string) {
    const environment = await this.prisma.environment.create({
      data: {
        name,
        projectId,
      },
    });

    return environment;
  }

  async getById(id: string) {
    const environment = await this.prisma.environment.findUnique({
      where: { id },
    });

    return environment;
  }

  async getAll(projectId: string) {
    const environments = await this.prisma.environment.findMany({
      where: {
        projectId,
      },
    });

    return environments;
  }

  async getByName(name: string, projectId: string) {
    const environment = await this.prisma.environment.findFirst({
      where: { name, projectId },
    });
    return environment;
  }

  async deleteEnvironment(id: string) {
    const environment = await this.prisma.environment.delete({
      where: { id },
    });

    return environment;
  }
}
