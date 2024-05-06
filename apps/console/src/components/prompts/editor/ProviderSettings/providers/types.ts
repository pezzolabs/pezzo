export interface OpenAIGptModelSettings {
  promptCostPer1000Tokens: number;
  completionsCostPer1000Tokens: number;
  maxTokens: number;
  trainingCostPer1000Tokens?: number;
}

export interface OpenAIGptCostOptions {
  promptTokens: number;
  completionTokens: number;
}
