import { Space } from "antd";
import { useGettingStartedWizard } from "../../lib/providers/GettingStartedWizardProvider";
import OpenAILogo from "../../../assets/openai-logo.svg";
import { SelectionItem } from "./SelectionItem";
import { ProviderType } from "@pezzo/types";

export const ProviderSelector = () => {
  const { provider, setProvider } = useGettingStartedWizard();

  return (
    <Space
      direction="horizontal"
      size="large"
      style={{ marginBottom: 12, gap: 48 }}
    >
      <SelectionItem
        logo={OpenAILogo}
        label={ProviderType.OpenAI}
        onClick={() => setProvider(ProviderType.OpenAI)}
        selected={provider === ProviderType.OpenAI}
      />
    </Space>
  );
};
