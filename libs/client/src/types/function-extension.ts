import { PromptVariables } from "./prompts";
import { Tail } from "./ts-helpers";
import {
  ObservabilityReportMetadata,
  ObservabilityReportProperties,
} from "./observability";
import { ChatCompletionRequestMessage } from "openai";

// Types that helps extending functions with Pezzo context or args

export interface PezzoInjectedContext {
  environment?: string;
  promptId?: string;
  promptVersionSha?: string;
  variables?: PromptVariables;
  content?: string;
  interpolatedMessages?: ChatCompletionRequestMessage[];
  metadata?: ObservabilityReportMetadata;
  properties?: ObservabilityReportProperties;
}

export interface PezzoContextExtension {
  pezzo?: PezzoInjectedContext;
}

export type PezzoArgExtension<TArgs extends unknown[]> = TArgs[0] &
  PezzoContextExtension;

export type PezzoExtendedArgs<
  TArgs extends unknown[],
  TArgExtension = PezzoArgExtension<TArgs>
> = [TArgExtension, ...Tail<TArgs>];
