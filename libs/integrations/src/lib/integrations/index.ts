export * from "./types";
import { IntegrationDefinition } from "./types";

import ai21Integration from "./ai21";
import openaiIntegration from "./openai";

export const getIntegration = (id: string): IntegrationDefinition => {
  return integrations[id];
};

export const integrations: { [key: string]: IntegrationDefinition } = {
  openai: openaiIntegration,
  ai21: ai21Integration,
};
