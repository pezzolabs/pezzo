import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateFineTunedModelInput } from "./inputs/create-fine-tuned-model.input";
import { CreateFineTunedModelVariantInput } from "./inputs/create-fine-tuned-model-variant.input";
import { DatasetsService } from "./datasets.service";
import { OpenAIFineTuningService } from "./openai-fine-tuning.service";
import { OpenAIFile } from "./types/fine-tuning.types";
import { FineTunedModelVariant } from "../../@generated/fine-tuned-model-variant/fine-tuned-model-variant.model";

@Injectable()
export class FineTuningService {
  constructor(
    private prisma: PrismaService,
    private datasetsService: DatasetsService,
    private openaiFineTuningService: OpenAIFineTuningService
  ) {}

  async getFineTunedModels(projectId: string) {
    return this.prisma.fineTunedModel.findMany({
      where: {
        projectId: projectId,
      },
    });
  }

  async getFineTunedModel(id: string) {
    return this.prisma.fineTunedModel.findUnique({
      where: {
        id,
      },
    });
  }

  async createFineTunedModel(data: CreateFineTunedModelInput) {
    return this.prisma.fineTunedModel.create({
      data: {
        projectId: data.projectId,
        name: data.name,
      },
    });
  }

  async getVariants(modelId: string) {
    return this.prisma.fineTunedModelVariant.findMany({
      where: {
        fineTunedModelId: modelId,
      },
    });
  }

  async getVariant(id: string) {
    return this.prisma.fineTunedModelVariant.findUnique({
      where: {
        id,
      },
    });
  }

  async createVariant(data: CreateFineTunedModelVariantInput) {
    const ds = await this.datasetsService.getDataset(data.datasetId);

    const file: OpenAIFile = await this.openaiFineTuningService.uploadDataset(
      ds.data as any
    );

    const fileTuningJob =
      await this.openaiFineTuningService.createFineTuningJob({
        suffix: data.slug,
        training_file: file.id,
        model: "gpt-3.5-turbo-0613",
      });

    const fineTunedModelVariant = await this.prisma.fineTunedModelVariant.create({
      data: {
        fineTunedModelId: data.modelId,
        slug: data.slug,
        dataSnapshot: ds.data,
        openaiTrainingFileId: file.id,
        openaiFineTuningJobId: fileTuningJob.id,
        status: "Pending"
      }
    });

    return fineTunedModelVariant;
  }
}
