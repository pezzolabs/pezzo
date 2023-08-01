import React from "react";
import { GetMeQuery } from "../../../@generated/graphql/graphql";
import { SEGMENT_WRITE_KEY } from "../../../env";

const shouldTrack = !!SEGMENT_WRITE_KEY;
if (!shouldTrack) {
  console.log("Segment analytics disabled");
  window.analytics = {
    identify: (...args: never) => null,
    group: (...args: never) => null,
    track: (...args: never) => null,
    load: (...args: never) => null,
    page: (...args: never) => null,
    screen: (...args: never) => null,
    alias: (...args: never) => null,
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
    // const orgId = user.organizationIds[0];
    const identifyRequest = {
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: user.photoUrl,
      // company: { id: orgId },
    };

    window.analytics.identify(identifyRequest);
    // window.analytics.group(orgId);
  }, [user]);
};

export type AnalyticsEvent = {
  login: "login";
  logout: "logout";
  how_to_consume_prompt: "how_to_consume_prompt";
};

export const trackEvent = (event: keyof AnalyticsEvent, properties?: any) => {
  window.analytics.track({ event, properties });
};
