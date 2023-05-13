import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class EnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async getBySlug(slug: string, organizationId: string) {
    const environment = await this.prisma.environment.findFirst({
      where: {
        slug,
        organizationId,
      }
    });

    return environment;
  }
}