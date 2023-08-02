import React from "react";
import Analytics from "analytics";
import segmentPlugin from "@analytics/segment";
import { GetMeQuery } from "../../../@generated/graphql/graphql";
import { SEGMENT_WRITE_KEY } from "../../../env";
import { AnalyticsEvent } from "./events.types";

const shouldTrack = !!SEGMENT_WRITE_KEY;

const analytics = Analytics({
  app: "awesome-app",
  plugins: shouldTrack
    ? [
        segmentPlugin({
          writeKey: SEGMENT_WRITE_KEY,
        }),
      ]
    : [],
});

export const useTrackInit = (userId: string) => {
  React.useEffect(() => {
    if (!userId) return;
    analytics.identify(userId);
  }, [userId]);
};

// Can be handled on backend
export const useIdentify = (user: GetMeQuery["me"]) => {
  React.useEffect(() => {
    if (!user) return;
    const groupId = JSON.parse(localStorage.getItem("currentOrgId"));

    const identifyRequest = {
      name: user.name,
      email: user.email,
      avatar: user.photoUrl,
      groupId,
    };

    analytics.identify(user.id, identifyRequest);
    // unsafe support for segment group in analytics lib
    (analytics.plugins as any).segment?.group(groupId, {});
  }, [user]);
};

interface ContextProps {
  organizationId?: string;
  projectId?: string;
  promptId?: string;
}

const getContextPropsFromPathIfExists = () => {
  const contextProps: ContextProps = {};
  const path = window.location.pathname;
  const [, projectsPath, projectId, promptsPath, promptId] = path.split("/");
  if (projectsPath === "projects" && projectId) {
    contextProps.projectId = projectId;
  }
  if (promptsPath === "prompts" && promptId) {
    contextProps.promptId = promptId;
  }
  return contextProps;
};

export const trackEvent = (
  event: keyof AnalyticsEvent,
  properties?: Record<string, any>
) => {
  const groupId = JSON.parse(localStorage.getItem("currentOrgId"));
  const context = { groupId };
  const contextProps = {
    ...getContextPropsFromPathIfExists(),
    organizationId: groupId,
  };
  analytics.track(event, { ...contextProps, ...properties }, context);
};
