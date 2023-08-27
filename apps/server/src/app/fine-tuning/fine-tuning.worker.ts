import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Interval } from "@nestjs/schedule";
import {
  FineTunedModelVariant,
  FineTunedModelVariantStatus,
} from "@prisma/client";
import { OpenAIFineTuningService } from "./openai-fine-tuning.service";

const openAIToPezzoStatusMapping = {
  created: FineTunedModelVariantStatus.Pending,
  pending: FineTunedModelVariantStatus.Pending,
  running: FineTunedModelVariantStatus.InProgress,
  failed: FineTunedModelVariantStatus.Failed,
  cancelled: FineTunedModelVariantStatus.Failed,
  succeeded: FineTunedModelVariantStatus.Completed,
};

@Injectable()
export class FineTuningWorker {
  constructor(
    private prisma: PrismaService,
    private openAIFineTuningService: OpenAIFineTuningService
  ) {}

  @Interval(10000)
  async checkFineTuningJobStatus() {
    const pendingJobs = await this.prisma.fineTunedModelVariant.findMany({
      where: {
        status: {
          in: [
            FineTunedModelVariantStatus.Pending,
            FineTunedModelVariantStatus.InProgress
          ]
        },
      },
    });

    await Promise.all(
      pendingJobs.map(async (job) =>
        this.handlePendingFineTunedModelVariant(job)
      )
    );
  }

  private async handlePendingFineTunedModelVariant(
    variant: FineTunedModelVariant
  ) {
    const job = await this.openAIFineTuningService.getFineTuningJob(
      variant.openaiFineTuningJobId
    );
    const pezzoStatus = openAIToPezzoStatusMapping[job.status];

    if (pezzoStatus === variant.status) {
      return;
    }

    console.log(`Updating fine tuning job status to ${pezzoStatus}`, {
      variantId: variant.id,
    });

    await this.prisma.fineTunedModelVariant.update({
      where: {
        id: variant.id,
      },
      data: {
        status: pezzoStatus,
        openaiFineTunedModelId: pezzoStatus === FineTunedModelVariantStatus.Completed ? job.fine_tuned_model : undefined,
      },
    });
  }
}
