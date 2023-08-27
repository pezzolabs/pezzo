import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FineTunedModel } from "../../@generated/fine-tuned-model/fine-tuned-model.model";
import { FineTuningService } from "./fine-tuning.service";
import { GetFineTunedModelsInput } from "./inputs/get-fine-tuned-models.input";
import { CreateFineTunedModelInput } from "./inputs/create-fine-tuned-model.input";
import { FineTunedModelWhereUniqueInput } from "../../@generated/fine-tuned-model/fine-tuned-model-where-unique.input";


@Resolver(FineTunedModel)
export class FineTuningResolver {
  constructor(private fineTuningService: FineTuningService) {}

  @Query(() => [FineTunedModel])
  async fineTunedModels(
    @Args("data") data: GetFineTunedModelsInput,
  ): Promise<FineTunedModel[]> {
    const result = await this.fineTuningService.getFineTunedModels(data.projectId);
    return result;
  }

  @Query(() => FineTunedModel)
  async fineTunedModel(
    @Args("data") data: FineTunedModelWhereUniqueInput,
  ): Promise<FineTunedModel> {
    return this.fineTuningService.getFineTunedModel(data.id);
  }

  @Mutation(() => FineTunedModel)
  async createFineTunedModel(
    @Args("data") data: CreateFineTunedModelInput,
  ): Promise<FineTunedModel> {
    return this.fineTuningService.createFineTunedModel(data);
  }
}