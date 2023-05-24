import { PromptExecution } from "@prisma/client";

export type BaseProjectEventPayload = {
  projectId: string;
};

// Event names follow the "{SUBJECT}:{ACTION}" pattern
export type AnalyticsPayloads = {
  "USER:SIGNUP": {
    email: string;
    method: "EMAIL_PASSWORD" | "GOOGLE";
  };
  "PROVIDER_API_KEY:CREATED": { projectId: string; provider: string };
  "ENVIRONMENT:CREATED": {
    environmentId: string;
    projectId: string;
    name: string;
  };
  "PROJECT:CREATED": { projectId: string; name: string };
  "PROMPT:CREATED": {
    projectId: string;
    promptId: string;
  };
  "PROMPT_VERSION:CREATED": {
    projectId: string;
    promptId: string;
  };
  "PROMPT:PUBLISHED": {
    promptId: string;
    environmentId: string;
    projectId: string;
  };
  "PROMPT:FIND_WITH_API_KEY": {
    projectId: string;
    promptId: string;
  };
  "PROMPT_EXECUTION:REPORTED": {
    projectId: string;
    promptId: string;
    executionId: string;
    integrationId: string;
    data: Partial<PromptExecution>;
  };
  "PROMPT:TESTED": {
    projectId: string;
    integrationId: string;
    executionId: string;
    data: Partial<PromptExecution>;
  };
};
