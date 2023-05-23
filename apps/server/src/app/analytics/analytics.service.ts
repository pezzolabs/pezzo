import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Analytics } from "@segment/analytics-node";
import { AnalyticsPayloads } from "./events.types";

@Injectable()
export class AnalyticsService {
  analytics: Analytics;
  segmentEnabled: boolean;

  constructor(
    private configService: ConfigService,
    private config: ConfigService
  ) {
    const segmentApiKey = this.config.get("SEGMENT_KEY");

    if (segmentApiKey) {
      const writeKey: string = this.configService.get("SEGMENT_KEY");

      if (!writeKey) {
        throw new Error("Segment write key not found (SEGMENT_KEY)");
      }

      console.log("Initializing Segment Analytics");
      this.analytics = new Analytics({
        writeKey,
      });
    } else {
      console.log("Segment analytics disabled");
    }
  }

  track<K extends keyof AnalyticsPayloads>(
    event: K,
    userId: string,
    properties: AnalyticsPayloads[K]
  ) {
    if (!this.analytics) {
      return;
    }

    return this.analytics.track({ userId, event, properties: properties });
  }
}
