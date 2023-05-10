import { Settings } from './types';
export * from './types';

export const defaultSettings: Settings = {
  model: "j2-jumbo-instruct",
  modelSettings: {
    numResults: 1,
    maxTokens: 200,
    temperature: 0.7,
    topKReturn: 0,
    topP: 1,
    countPenalty: {
      scale: 0,
      applyToNumbers: false,
      applyToPunctuations: false,
      applyToStopwords: false,
      applyToWhitespaces: false,
      applyToEmojis: false,
    },
    frequencyPenalty: {
      scale: 0,
      applyToNumbers: false,
      applyToPunctuations: false,
      applyToStopwords: false,
      applyToWhitespaces: false,
      applyToEmojis: false,
    },
    presencePenalty: {
      scale: 0,
      applyToNumbers: false,
      applyToPunctuations: false,
      applyToStopwords: false,
      applyToWhitespaces: false,
      applyToEmojis: false,
    },
    stopSequences: [],
  },
};
