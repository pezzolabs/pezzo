import { FormField, FormSchema, SliderFormField } from "../form.types";
import { OpenAIIntegrationSettings } from "./types";

const settingsSchema: FormSchema = [
  {
    label: "Model",
    name: ["settings", "model"],
    type: "select",
    defaultValue: "gpt-3.5-turbo",
    options: [
      { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
      { value: "gpt-3.5-turbo-16k", label: "gpt-3.5-turbo-16k" },
      { value: "gpt-4", label: "gpt-4" },
    ],
  },
  {
    label: "Temperature",
    name: ["settings", "modelSettings", "temperature"],
    type: "slider",
    min: 0,
    max: 2,
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
  },
];

export const generateSchema = (modelName: string): FormSchema => {
  const settings = [...settingsSchema];

  // check if type is slider (with typescript "is" operator)
  const isSlider = (setting: FormField): setting is SliderFormField =>
    setting.type === "slider";

  const sliders = settings.filter(isSlider);
  const maxTokensField = sliders.find(
    (field) => field.name[2] === "max_tokens"
  );

  if (modelName === "gpt-4") {
    maxTokensField.max = 8192;
  } else if (modelName === "gpt-3.5-turbo-16k") {
    maxTokensField.max = 16384;
  } else if (modelName === "gpt-3.5-turbo") {
    maxTokensField.max = 4096;
  }

  return settingsSchema;
};

export const defaultSettings: OpenAIIntegrationSettings = {
  model: "gpt-3.5-turbo",
  modelSettings: {
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
};
