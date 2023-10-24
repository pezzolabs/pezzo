import { Space } from "antd";
import {
  Usage,
  useGettingStartedWizard,
} from "~/lib/providers/GettingStartedWizardProvider";
import { SelectionItem } from "./SelectionItem";

export const UsageSelector = () => {
  const { usage, setUsage } = useGettingStartedWizard();

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ marginBottom: 12, gap: 48 }}
    >
      <SelectionItem
        label="Observability and Prompt Management (Recommended)"
        onClick={() => setUsage(Usage.ObservabilityAndPromptManagement)}
        selected={usage === Usage.ObservabilityAndPromptManagement}
      />
      <SelectionItem
        label="Observability only"
        onClick={() => setUsage(Usage.Observability)}
        selected={usage === Usage.Observability}
      />
    </Space>
  );
};
