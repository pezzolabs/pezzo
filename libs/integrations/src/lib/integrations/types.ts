import { BaseExecutor } from "./BaseExecutor";
import { FormSchema } from "./form.types";

export interface IntegrationDefinition {
  id: string;
  name: string;
  provider: string;
  iconBase64: string;
  Executor: new (...args: any[]) => BaseExecutor;
  settingsSchema: FormSchema;
  defaultSettings: any;
}