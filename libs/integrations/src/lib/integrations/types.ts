import { BaseIntegration } from "./BaseIntegration";
import { FormSchema } from "./form.types";

export interface IntegrationDefinition {
  id: string;
  name: string;
  provider: string;
  iconBase64: string;
  executor: new (...args: any[]) => BaseIntegration;
  settingsSchema: FormSchema;
  defaultSettings: any;
}