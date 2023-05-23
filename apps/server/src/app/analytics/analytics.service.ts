import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Analytics } from '@segment/analytics-node';
import { AnalyticsEvents, AnalyticsPayloads } from './events.types';
import { PinoLogger } from '../logger/pino-logger';

@Injectable()
export class AnalyticsService {
  analytics: Analytics;
  segmentEnabled: boolean;

  constructor(
    private configService: ConfigService,
    private logger: PinoLogger,
    private config: ConfigService
  ) {
    const segmentApiKey = this.config.get('SEGMENT_KEY');
    
    if (segmentApiKey) {
      const writeKey: string = this.configService.get('SEGMENT_KEY');
  
      if (!writeKey) {
        throw new Error('Segment write key not found (SEGMENT_KEY)');
      }
  
      this.logger.info('Initializing Segment Analytics');
      this.analytics = new Analytics({
        writeKey
      });

      this.logger.info('Segment analytics enabled');
    } else {
      this.logger.info('Segment analytics disabled');
    }

  }


  track<K extends AnalyticsEvents>(event: K, userId: string, properties: AnalyticsPayloads[K]) {
    if (!this.analytics) {
      return;
    }

    return this.analytics.track({ userId, event, properties: properties });
  }
}
