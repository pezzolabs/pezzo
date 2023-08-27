import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateDatasetInput } from "./inputs/create-dataset.input";

@Injectable()
export class DatasetsService {
  constructor(private prismaService: PrismaService) {}

  createDataset(data: CreateDatasetInput) {
    return this.prismaService.dataset.create({
      data: {
        projectId: data.projectId,
        name: data.name,
      }
    });
  }

  getDatasets(projectId: string) {
    return this.prismaService.dataset.findMany({
      where: {
        projectId
      }
    });
  }

  getDataset(id: string) {
    return this.prismaService.dataset.findUnique({
      where: {
        id
      }
    });
  }

  async insertToDataset(datasetId: string, data: Record<string, any>[]) {
    const dataset = await this.prismaService.dataset.findUnique({
      where: {
        id: datasetId
      }
    });

    return this.prismaService.dataset.update({
      where: {
        id: datasetId
      },
      data: {
        data: [ ...dataset.data as Array<any>, data ]
      }
    });
  }

}