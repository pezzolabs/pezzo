import { Module } from "@nestjs/common";
import { LoggerModule } from "../logger/logger.module";
import { ClickHouseService } from "./clickhouse.service";

@Module({
  imports: [LoggerModule],
  providers: [ClickHouseService],
  exports: [ClickHouseService],
})
export class ClickhHouseModule {}
