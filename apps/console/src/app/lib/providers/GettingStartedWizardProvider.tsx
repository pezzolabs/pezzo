import { ProviderType } from "@pezzo/types";
import { createContext, useContext, useEffect, useState } from "react";

export enum Language {
  TypeScript = "TypeScript",
}

export enum Usage {
  Observability = "Observability",
  ObservabilityAndPromptManagement = "ObservabilityAndPromptManagement",
}

interface GettingStartedWizardContextValue {
  currentStep: number;
  provider: ProviderType;
  setProvider: (provider: ProviderType) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  usage: Usage;
  setUsage: (usage: Usage) => void;
}

export const GetingStartedWizardContext = createContext<
  GettingStartedWizardContextValue | undefined
>(undefined);
export const useGettingStartedWizard = () =>
  useContext(GetingStartedWizardContext);

interface Props {
  children: React.ReactNode;
}

export const GettingStartedWizardProvider = ({ children }: Props) => {
  const [provider, _setProvider] = useState<ProviderType | undefined>();
  const [language, _setLanguage] = useState<Language | undefined>();
  const [usage, _setUsage] = useState<Usage | undefined>();

  const determineCurrentStep = () => {
    if (usage) {
      return 3;
    }

    if (language) {
      return 2;
    }

    if (provider) {
      return 1;
    }

    return 0;
  };

  const setProvider = (provider: ProviderType) => {
    _setLanguage(undefined);
    _setUsage(undefined);
    _setProvider(provider);
  };

  const setLanguage = (language: Language) => {
    _setLanguage(language);
  };

  const setUsage = (usage: Usage) => {
    _setUsage(usage);
  };

  return (
    <GetingStartedWizardContext.Provider
      value={{
        currentStep: determineCurrentStep(),
        provider,
        setProvider,
        language,
        setLanguage,
        usage,
        setUsage,
      }}
    >
      {children}
    </GetingStartedWizardContext.Provider>
  );
};
