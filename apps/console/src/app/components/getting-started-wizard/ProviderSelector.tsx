import { Space } from "antd";
import { useGettingStartedWizard } from "../../lib/providers/GettingStartedWizardProvider";
import OpenAILogo from "../../../assets/providers/openai-logo.svg";
import { SelectionItem } from "./SelectionItem";
import { Provider } from "@pezzo/types";

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
        label={Provider.OpenAI}
        onClick={() => setProvider(Provider.OpenAI)}
        selected={provider === Provider.OpenAI}
      />
    </Space>
  );
};
