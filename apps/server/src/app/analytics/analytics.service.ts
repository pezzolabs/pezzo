import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Analytics } from "@segment/analytics-node";
import { AnalyticsEvent } from "./events.types";
import { CONTEXT } from "@nestjs/graphql";
import { getRequestContext } from "../cls.utils";

export interface EventContextProps {
  userId?: string;
  organizationId?: string;
  projectId?: string;
  promptId?: string;
}

const getId = (context: EventContextProps) => {
  if (context.userId) return context.userId;
  if (context.organizationId) return `org:${context.organizationId}`;
  if (context.projectId) return `project:${context.projectId}`;
  return "anonymous";
};

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

    if (!segmentApiKey) {
      console.log("Segment analytics disabled");
      this.segmentEnabled = false;
    } else {
      this.analytics = new Analytics({
        writeKey: segmentApiKey,
      });
      this.segmentEnabled = true;
    }
  }

  trackEvent = (
    event: keyof typeof AnalyticsEvent,
    properties?: Record<string, any> & EventContextProps
  ) => {
    if (!this.segmentEnabled) return;

    const eventContext = {
      ...this.context.eventContext,
      ...getRequestContext(),
    };

    const { organizationId, projectId, promptId } = eventContext;
    const eventPayload = {
      event,
      userId: getId(eventContext),
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
