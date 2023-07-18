import { Provider } from "@pezzo/types";
import { createContext, useContext, useMemo, useState } from "react";

export enum Language {
  TypeScript = "TypeScript",
}

export enum Usage {
  Observability = "Observability",
  ObservabilityAndPromptManagement = "ObservabilityAndPromptManagement",
}

interface GettingStartedWizardContextValue {
  currentStep: number;
  provider: Provider;
  setProvider: (provider: Provider) => void;
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
  const [provider, setProvider] = useState<Provider | undefined>();
  const [language, setLanguage] = useState<Language | undefined>();
  const [usage, setUsage] = useState<Usage | undefined>();

  const currentStep = useMemo(() => {
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
  }, [usage, language, provider]);

  const handleProviderChange = (provider: Provider) => {
    setLanguage(undefined);
    setUsage(undefined);
    setProvider(provider);
  };

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
  };

  const handleUsageChange = (usage: Usage) => {
    setUsage(usage);
  };

  return (
    <GetingStartedWizardContext.Provider
      value={{
        currentStep,
        provider,
        setProvider: handleProviderChange,
        language,
        setLanguage: handleLanguageChange,
        usage,
        setUsage: handleUsageChange,
      }}
    >
      {children}
    </GetingStartedWizardContext.Provider>
  );
};
