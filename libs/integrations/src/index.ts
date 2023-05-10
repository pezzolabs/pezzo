import { OpenAIService } from "./lib/integrations";

export * from "./lib/integrations";

const integrationsMapping = {
  'openai-chat': OpenAIService,
  // 'ai21': AI21Service,
}