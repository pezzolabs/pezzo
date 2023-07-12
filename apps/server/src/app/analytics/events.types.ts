import { PromptExecution } from "@prisma/client";

// Event names follow the "{SUBJECT}:{ACTION}" pattern
export type AnalyticsPayloads = {
  "USER:SIGNUP": {
    email: string;
    method: "EMAIL_PASSWORD" | "GOOGLE";
  };
  "PROVIDER_API_KEY:CREATED": { organizationId: string; provider: string };
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
  "PROMPT:DELETED": {
    promptId: string;
    projectId: string;
    organizationId: string;
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
    organizationId: string;
    projectId: string;
    promptId: string;
  };
  "PROMPT_EXECUTION:REPORTED": {
    projectId: string;
    promptId: string;
    executionId: string;
    data: Partial<PromptExecution>;
  };
  "PROMPT:TESTED": {
    organizationId: string;
    projectId: string;
    executionId: string;
    data: Partial<PromptExecution>;
  };
};
