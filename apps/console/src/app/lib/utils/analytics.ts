import React from "react";
import { GetMeQuery } from "../../../@generated/graphql/graphql";
import { SEGMENT_WRITE_KEY } from "../../../env";
import { AnalyticsEvent } from "./event.types";

const shouldTrack = !!SEGMENT_WRITE_KEY;
if (!shouldTrack) {
  console.log("Segment analytics disabled");
  window.analytics = {
    identify: (...args: never) => null,
    group: (...args: never) => null,
    track: (...args: never) => null,
    load: (...args: never) => null,
    flush: (...args: never) => null,
  };
}

export const useTrackInit = (userId: string) => {
  React.useEffect(() => {
    if (!window.analytics) return;
    (window.analytics as any)._writeKey = SEGMENT_WRITE_KEY;
    window.analytics.load(SEGMENT_WRITE_KEY);
  }, []);

  React.useEffect(() => {
    if (!userId) return;
    window.analytics.identify(userId);
  }, [userId]);
};

// Can be handled on backend
export const useIdentify = (user: GetMeQuery["me"]) => {
  React.useEffect(() => {
    if (!user) return;
    const groupId = JSON.parse(localStorage.getItem("currentOrgId"));

    const identifyRequest = {
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: user.photoUrl,
      groupId,
    };

    window.analytics.identify(identifyRequest);
    window.analytics.group(groupId);
  }, [user]);
};

export const trackEvent = (
  event: keyof AnalyticsEvent,
  properties?: Record<string, any>
) => {
  const groupId = JSON.parse(localStorage.getItem("currentOrgId"));
  const context = { groupId };
  window.analytics.track(
    event,
    { ...properties, organizationId: groupId },
    context
  );
};
