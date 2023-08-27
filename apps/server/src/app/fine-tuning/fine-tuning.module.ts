import { Module } from "@nestjs/common";
import { FineTuningResolver } from "./fine-tuning.resolver";
import { FineTuningService } from "./fine-tuning.service";
import { IdentityModule } from "../identity/identity.module";
import { AuthModule } from "../auth/auth.module";
import { PrismaService } from "../prisma.service";
import { DatasetsService } from "./datasets.service";
import { DatasetsController } from "./datasets.controller";
import { DatasetResolver } from "./datasets.resolver";
import { FineTunedModelVariantResolver } from "./fine-tuned-model-variant.resolver";
import { OpenAIFineTuningService } from "./openai-fine-tuning.service";
import { FineTuningWorker } from "./fine-tuning.worker";

@Module({
  imports: [IdentityModule, AuthModule],
  providers: [
    FineTuningResolver,
    FineTuningService,
    FineTunedModelVariantResolver,
    DatasetResolver,
    DatasetsService,
    PrismaService,
    OpenAIFineTuningService,
    FineTuningWorker,
  ],
  controllers: [
    DatasetsController
  ],
})
export class FineTuningModule {}