import { Global, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Global()
@Module({
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}