export * from "./types";
export * from "./openai/executor";
export * from "./ai21/executor";

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

export const getUniqueProviders = (): string[] => {
  const providers = new Set<string>();
  for (const integration of Object.values(integrations)) {
    providers.add(integration.provider);
  }
  return Array.from(providers);
};
