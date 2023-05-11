export * from "./openai";

import { integration as ai21Integration } from './ai21';
import { IntegrationDefinition } from "./types";

export const getIntegration = (id: string): IntegrationDefinition => {
  return integrations[id];
};

export const integrations: { [key: string]: IntegrationDefinition } = {
  'ai21': ai21Integration,
}