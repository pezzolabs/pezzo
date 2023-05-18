import { FormSchema } from "./form.types";

export interface IntegrationDefinition {
  id: string;
  name: string;
  provider: string;
  iconBase64: string;
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

export class PezzoClientError<T> extends Error {
  constructor(
    message: string,
    private error: T,
    private statusCode: number | null = null
  ) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
  }
}
