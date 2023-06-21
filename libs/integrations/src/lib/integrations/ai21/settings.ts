import { FormSchema } from "../form.types";
import { AI21IntegrationSettings } from "./types";

const settingsSchema: FormSchema = [
  {
    label: "Model",
    name: ["settings", "model"],
    type: "select",
    defaultValue: "j2-jumbo-instruct",
    options: [
      { value: "j2-jumbo-instruct", label: "j2-jumbo-instruct" },
      { value: "j2-grande-instruct", label: "j2-grande-instruct" },
    ],
  },
  {
    label: "Max completion length",
    name: ["settings", "modelSettings", "maxTokens"],
    type: "slider",
    min: 1,
    max: 8191,
    step: 1,
  },
  {
    label: "Temperature",
    name: ["settings", "modelSettings", "temperature"],
    type: "slider",
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    label: "Top P",
    name: ["settings", "modelSettings", "topP"],
    type: "slider",
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    label: "Presence Penalty",
    name: ["settings", "modelSettings", "presencePenalty", "scale"],
    type: "slider",
    min: 0,
    max: 5,
    step: 0.1,
  },
  {
    label: "Count Penalty",
    name: ["settings", "modelSettings", "countPenalty", "scale"],
    type: "slider",
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    label: "Frequency Penalty",
    name: ["settings", "modelSettings", "frequencyPenalty", "scale"],
    type: "slider",
    min: 0,
    max: 500,
    step: 1,
  },
];

export const generateSchema = (_: string): FormSchema => settingsSchema;

export const defaultSettings: AI21IntegrationSettings = {
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
