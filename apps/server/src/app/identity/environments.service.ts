import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { randomBytes } from "crypto";

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

    const apiKeyValue = `pez_${randomBytes(16).toString("hex")}`;
    await this.prisma.apiKey.create({
      data: {
        id: apiKeyValue,
        environmentId: environment.id,
      },
    });


    return environment;
  }

  async getById(id: string) {
    const environment = await this.prisma.environment.findUnique({ where: { id }});

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
    const environment = await this.prisma.environment.findFirst({ where: { name, projectId }});
    return environment;
  }
}
