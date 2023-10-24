import { Space } from "antd";
import {
  Language,
  useGettingStartedWizard,
} from "~/lib/providers/GettingStartedWizardProvider";
import TypeScriptLogo from "~/assets/typescript-logo.svg";
import { SelectionItem } from "./SelectionItem";

export const ProgrammingLanguageSelector = () => {
  const { language, setLanguage } = useGettingStartedWizard();

  return (
    <Space
      direction="horizontal"
      size="large"
      style={{ marginBottom: 12, gap: 48 }}
    >
      <SelectionItem
        logo={TypeScriptLogo}
        label={Language.TypeScript}
        onClick={() => setLanguage(Language.TypeScript)}
        selected={language === Language.TypeScript}
      />
    </Space>
  );
};
