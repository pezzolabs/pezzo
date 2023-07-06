import { ProviderType } from "@pezzo/types";
import {
  Language,
  useGettingStartedWizard,
} from "../../../lib/providers/GettingStartedWizardProvider";
import { TypeScriptOpenAIIntegrationTutorial } from "./TypeScriptOpenAIIntegrationTutorial";

export const IntegrateTutorial = () => {
  const { language, provider } = useGettingStartedWizard();

  console.log({ language, provider });

  if (provider === ProviderType.OpenAI && language === Language.TypeScript) {
    return <TypeScriptOpenAIIntegrationTutorial />;
  }
};
