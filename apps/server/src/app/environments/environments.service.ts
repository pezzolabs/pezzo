import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class EnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBySlug(slug: string, projectId: string) {
    const environment = await this.prisma.environment.findFirst({
      where: {
        slug,
        projectId,
      },
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
}
