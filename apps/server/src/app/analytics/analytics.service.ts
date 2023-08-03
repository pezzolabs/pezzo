import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Analytics } from "@segment/analytics-node";
import { AnalyticsEvent } from "./events.types";
import { CONTEXT } from "@nestjs/graphql";

export interface EventContextProps {
  userId?: string;
  organizationId?: string;
  projectId?: string;
  promptId?: string;
}

@Injectable()
export class AnalyticsService {
  analytics: Analytics;
  segmentEnabled: boolean;

  constructor(
    private configService: ConfigService,
    private config: ConfigService,
    @Inject(CONTEXT)
    private readonly context: { eventContext: EventContextProps } = {
      eventContext: null,
    }
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

  trackEvent = (
    event: keyof typeof AnalyticsEvent,
    properties?: Record<string, any> & EventContextProps
  ) => {
    const { userId, organizationId, projectId, promptId } =
      this.context.eventContext;
    const eventPayload = {
      event,
      userId,
      properties: {
        organizationId,
        projectId,
        promptId,
        ...properties,
      },
      context: {
        groupId: organizationId,
      },
    };

    this.analytics.track(eventPayload);
  };
}
