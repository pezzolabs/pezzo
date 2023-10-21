import React from "react";
import Analytics from "analytics";
import segment from "@analytics/segment";
import { GetMeQuery } from "../../../@generated/graphql/graphql";
import googleTagManager from "@analytics/google-tag-manager";
import { SEGMENT_WRITE_KEY, GTM_TAG_ID } from "../../../env";
import { AnalyticsEvent } from "./events.types";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { useCurrentOrganization } from "../hooks/useCurrentOrganization";

const getAnalyticsPlugins = () => {
  const plugins = [];

  // Segment
  if (SEGMENT_WRITE_KEY) {
    plugins.push(
      segment({
        writeKey: SEGMENT_WRITE_KEY,
      })
    );
  }

  // GTM
  if (GTM_TAG_ID) {
    plugins.push(
      googleTagManager({
        containerId: GTM_TAG_ID,
      })
    );
  }

  return plugins;
};

const analytics = Analytics({
  app: "pezzo-console",
  plugins: getAnalyticsPlugins(),
});

// Can be handled on backend
export const useIdentify = (user: GetMeQuery["me"]) => {
  const { projectId } = useCurrentProject();
  const { organizationId } = useCurrentOrganization();

  React.useEffect(() => {
    if (!user) return;
    const segmentUserId = JSON.parse(localStorage.getItem("ajs_user_id"));
    if (segmentUserId === user.id) return;

    const identifyRequest = {
      userId: user.id,
      name: user.name,
      email: user.email,
      organizationId,
      projectId,
    };

    // unsafe support for segment group in analytics lib
    (analytics.plugins as any).segment?.group(organizationId, {});

    const window = (global as any).window;

    // GTM data layer
    window.dataLayer.push({ ...identifyRequest });
  }, [user, organizationId, projectId]);
};

export interface ContextProps {
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
  event: keyof typeof AnalyticsEvent,
  properties?: Record<string, any> & ContextProps
) => {
  const groupId = JSON.parse(localStorage.getItem("currentOrgId"));
  const context = { groupId };
  const contextProps = {
    ...getContextPropsFromPathIfExists(),
    organizationId: groupId,
  };
  analytics.track(event, { ...contextProps, ...properties }, context);
};
