import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getProject(projectId: string) {
    return this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
  }
}
