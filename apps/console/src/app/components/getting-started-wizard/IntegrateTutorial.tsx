import { Provider } from "@pezzo/types";
import {
  Language,
  useGettingStartedWizard,
} from "../../lib/providers/GettingStartedWizardProvider";
import { TypeScriptOpenAIIntegrationTutorial } from "./TypeScriptOpenAIIntegrationTutorial";

export const IntegrateTutorial = () => {
  const { language, provider } = useGettingStartedWizard();

  if (provider === Provider.OpenAI && language === Language.TypeScript) {
    return <TypeScriptOpenAIIntegrationTutorial />;
  }
};
