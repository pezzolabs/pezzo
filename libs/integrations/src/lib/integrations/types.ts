import { BaseExecutor } from "./base-executor";
import { FormSchema } from "./form.types";

export interface IntegrationDefinition {
  id: string;
  name: string;
  provider: string;
  iconBase64: string;
  Executor: new (...args: any[]) => BaseExecutor;
  settingsSchema: FormSchema;
  defaultSettings: any;
  consumeInstructionsFn: (
    promptName: string,
    variables: Record<string, string>,
    pezzoApiKey: string
  ) => string;
}

export interface IntegrationBaseSettings<T> {
  model: string;
  modelSettings: T;
}

export interface ExecutorOptions {
  apiKey: string;
}
