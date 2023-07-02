import { PromptVariables } from "./prompts";
import { Tail } from "./ts-helpers";
import {
  ObservabilityReportMetadata,
  ObservabilityReportProperties,
} from "./observability";

// Types that helps extending functions with Pezzo context or args

export interface PezzoInjectedContext {
  environmentName?: string;
  promptId?: string;
  promptVersionSha?: string;
  variables?: PromptVariables;
  content?: string;
  interpolatedContent?: string;
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
