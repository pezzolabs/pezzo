import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FineTuningService } from "./fine-tuning.service";
import { GetFineTunedModelVariantsInput } from "./inputs/get-fine-tuned-model-variants.input";
import { FineTunedModelVariant } from "../../@generated/fine-tuned-model-variant/fine-tuned-model-variant.model";
import { FineTunedModelVariantWhereUniqueInput } from "../../@generated/fine-tuned-model-variant/fine-tuned-model-variant-where-unique.input";
import { CreateFineTunedModelVariantInput } from "./inputs/create-fine-tuned-model-variant.input";
import { OpenAIFineTuningService } from "./openai-fine-tuning.service";
import { EnrichedFineTuneModelVariant } from "./models/enriched-fine-tuned-model-variant.model";

@Resolver(EnrichedFineTuneModelVariant)
export class FineTunedModelVariantResolver {
  constructor(private fineTuningService: FineTuningService, private openaiFinTuningService: OpenAIFineTuningService) {}

  @Query(() => [EnrichedFineTuneModelVariant])
  async fineTunedModelVariants(
    @Args("data") data: GetFineTunedModelVariantsInput,
  ): Promise<EnrichedFineTuneModelVariant[]> {
    const result = await this.fineTuningService.getVariants(data.modelId);
    const enriched = Promise.all(result.map(r => this.enrichVariantWithOpenAIData(r)));
    return enriched;
  }

  @Query(() => EnrichedFineTuneModelVariant)
  async fineTunedModelVariant(
    @Args("data") data: FineTunedModelVariantWhereUniqueInput,
  ): Promise<EnrichedFineTuneModelVariant> {
    return this.fineTuningService.getVariant(data.id);
  }

  @Mutation(() => EnrichedFineTuneModelVariant)
  async createFineTunedModelVariant(
    @Args("data") data: CreateFineTunedModelVariantInput,
  ): Promise<EnrichedFineTuneModelVariant> {
    return this.fineTuningService.createVariant(data);
  }

  private async enrichVariantWithOpenAIData(variant: FineTunedModelVariant): Promise<EnrichedFineTuneModelVariant> {
    const openaiFineTuningJob = await this.openaiFinTuningService.getFineTuningJob(variant.openaiFineTuningJobId);

    return {
      ...variant,
      enrichment: JSON.stringify({
        model: openaiFineTuningJob.model,
        trained_tokens: openaiFineTuningJob.trained_tokens,
        fine_tuned_model: openaiFineTuningJob.fine_tuned_model,
        hyperparameters: openaiFineTuningJob.hyperparameters,
      })
    }
  }
}