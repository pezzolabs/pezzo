export interface AI21ServiceOptions {
  apiKey: string;
}

export interface AI21CompleteOptions {
  autoParse?: boolean;
}

export interface IntegrationSettings {
  model: "j2-jumbo-instruct" | "j2-grande-instruct" | "j2-jumbo" | "j2-grande";
  modelSettings: {
    numResults: number;
    maxTokens: number;
    temperature: number;
    topKReturn: number;
    topP: number;
    countPenalty: {
      scale: number;
      applyToNumbers: boolean;
      applyToPunctuations: boolean;
      applyToStopwords: boolean;
      applyToWhitespaces: boolean;
      applyToEmojis: boolean;
    };
    frequencyPenalty: {
      scale: number;
      applyToNumbers: boolean;
      applyToPunctuations: boolean;
      applyToStopwords: boolean;
      applyToWhitespaces: boolean;
      applyToEmojis: boolean;
    };
    presencePenalty: {
      scale: number;
      applyToNumbers: boolean;
      applyToPunctuations: boolean;
      applyToStopwords: boolean;
      applyToWhitespaces: boolean;
      applyToEmojis: boolean;
    };
    stopSequences: string[];
  };
}
