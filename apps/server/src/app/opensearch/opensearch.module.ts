import { Module } from "@nestjs/common";
import { LoggerModule } from "../logger/logger.module";
import { OpenSearchService } from "./opensearch.service";

@Module({
  imports: [LoggerModule],
  providers: [OpenSearchService],
  exports: [OpenSearchService],
})
export class OpenSearchModule {}
