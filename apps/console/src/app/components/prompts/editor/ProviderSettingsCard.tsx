import { Button, Divider, Form } from "antd";
import { usePromptVersionEditorContext } from "../../../lib/providers/PromptVersionEditorContext";
import { ProviderSelector } from "./PromptSelector/ProviderSelector";
import { ProviderSettingsKeys } from "@pezzo/types";
import { useState } from "react";
import { ProviderSettingsSchemaRenderer } from "./ProviderSettings/ProviderSettingsSchemaRenderer";
import { openAIChatCompletionSettingsDefinition } from "./ProviderSettings/providers/openai-chat-completion";
import { SendOutlined } from "@ant-design/icons";

const providerSettings = {
  [ProviderSettingsKeys.OPENAI_CHAT_COMPLETION]:
    openAIChatCompletionSettingsDefinition,
};

interface Props {
  onOpenFunctionsModal: () => void;
}

export const ProviderSettingsCard = ({ onOpenFunctionsModal }: Props) => {
  const { form } = usePromptVersionEditorContext();
  const settings = Form.useWatch("settings", { form, preserve: true });
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderSettingsKeys>(null);

  if (!settings) {
    return null;
  }

  const handleSelectProvider = (provider: ProviderSettingsKeys) => {
    setSelectedProvider(provider);
  };

  const handleAddProvider = (provider: ProviderSettingsKeys) => {
    form.setFieldsValue({
      settings: {
        ...settings,
        [provider]: providerSettings[provider].defaultSettings,
      },
    });
  };

  return (
    <>
      <ProviderSelector
        selectedProvider={selectedProvider}
        onSelect={handleSelectProvider}
        onAdd={handleAddProvider}
      />
      {selectedProvider && (
        <>
          <Divider />
          <ProviderSettingsSchemaRenderer
            schema={providerSettings[selectedProvider].generateFormSchema(
              settings[selectedProvider]
            )}
            baseFieldPath={["settings", selectedProvider]}
          />
          {onOpenFunctionsModal && (
            <Button onClick={onOpenFunctionsModal} icon={<SendOutlined />}>
              Edit Functions
            </Button>
          )}
        </>
      )}
    </>
  );
};
