import { FormSchema } from "../form.types";
import { IntegrationSettings } from "./types";

export const settingsSchema: FormSchema = [
  {
    label: "Model",
    name: ["settings", "model"],
    type: "select",
    defaultValue: "gpt-3.5-turbo",
    options: [
      { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
      { value: "gpt-4", label: "gpt-4" },
    ],
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
    label: "Max Response Length",
    name: ["settings", "modelSettings", "max_tokens"],
    type: "slider",
    min: 1,
    max: 2048,
    step: 1,
  },
  {
    label: "Top P",
    name: ["settings", "modelSettings", "top_p"],
    type: "slider",
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    label: "Frequency Penalty",
    name: ["settings", "modelSettings", "frequency_penalty"],
    type: "slider",
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    label: "Presence Penalty",
    name: ["settings", "modelSettings", "presence_penalty"],
    type: "slider",
    min: 0,
    max: 1,
    step: 0.1,
  }
];

export const defaultSettings: IntegrationSettings = {
  model: "gpt-3.5-turbo",
  modelSettings: {
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
};
