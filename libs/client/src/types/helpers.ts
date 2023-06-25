import { PromptVariables } from "./prompts";

// GENERIC TS HELPERS
export type Tail<T extends unknown[]> = T extends [infer Head, ...infer Tail]
  ? Tail
  : never;

// SPECIFIC PEZZO HELPERS
export interface PezzoInjectedContext {
  environmentName: string;
  promptId: string;
  promptVersionSha: string;
  variables?: PromptVariables;
  content: string;
  interpolatedContent: string;
}

export type PezzoExtendedArg<TArgs extends unknown[]> = TArgs[0] & {
  _pezzo?: PezzoInjectedContext;
};

export type PezzoExtendedArgs<TArgs extends unknown[]> = [
  PezzoExtendedArg<TArgs>,
  ...Tail<TArgs>
];
