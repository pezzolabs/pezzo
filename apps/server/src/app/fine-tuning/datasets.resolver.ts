import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Dataset } from "../../@generated/dataset/dataset.model";
import { DatasetsService } from "./datasets.service";
import { GetDatasetsInput } from "./inputs/get-datasets.input";
import { DatasetWhereUniqueInput } from "../../@generated/dataset/dataset-where-unique.input";
import { CreateDatasetInput } from "./inputs/create-dataset.input";
import { InsertToDatasetInput } from "./inputs/insert-to-dataset.input";


@Resolver(Dataset)
export class DatasetResolver {
  constructor(private datasetsService: DatasetsService) {}

  @Query(() => [Dataset])
  async datasets(
    @Args("data") data: GetDatasetsInput,
  ): Promise<Dataset[]> {
    const result = await this.datasetsService.getDatasets(data.projectId);
    return result;
  }

  @Query(() => Dataset)
  async dataset(
    @Args("data") data: DatasetWhereUniqueInput,
  ): Promise<Dataset> {
    return this.datasetsService.getDataset(data.id);
  }

  @Mutation(() => Dataset)
  async createDataset(
    @Args("data") data: CreateDatasetInput,
  ): Promise<Dataset> {
    return this.datasetsService.createDataset(data);
  }

  @Mutation(() => Dataset)
  async insertToDataset(
    @Args("data") data: InsertToDatasetInput,
  ): Promise<Dataset> {
    return this.datasetsService.insertToDataset(data.datasetId, data.data);
  }
}