import { InternalServerErrorException, UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "../auth/auth.guard";
import { OpenSearchService } from "./opensearch.service";
import { RequestReport } from "./object-types/request-report.model";
import { PinoLogger } from "../logger/pino-logger";


@UseGuards(AuthGuard)
@Resolver(() => RequestReport)
export class RequestReportsResolver {

  constructor(
    private readonly openSearchService: OpenSearchService,
    private readonly logger: PinoLogger,
  ) { }

  @Query(() => [RequestReport])
  async requestReports() {
    try {
      const data = await this.openSearchService.getReports();

      return data.body.hits.hits.map((hit) => hit._source);


    } catch (error) {
      this.logger.error({ error }, "Error getting reports from OpenSearch");
      throw new InternalServerErrorException();
    }
  }

}
