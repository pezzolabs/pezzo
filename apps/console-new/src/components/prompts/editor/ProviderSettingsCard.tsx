import { Divider, Form } from "antd";
import { usePromptVersionEditorContext } from "~/lib/providers/PromptVersionEditorContext";
import { ProviderSelector } from "./ProviderSelector/ProviderSelector";
import { PromptService } from "@pezzo/types";
import { ProviderSettingsSchemaRenderer } from "./ProviderSettings/ProviderSettingsSchemaRenderer";
import { openAIChatCompletionSettingsDefinition } from "./ProviderSettings/providers/openai-chat-completion";
import { azureOpenAIChatCompletionSettingsDefinition } from "./ProviderSettings/providers/azure-openai-chat-completion";

const providerSettings = {
  [PromptService.OpenAIChatCompletion]: openAIChatCompletionSettingsDefinition,
  [PromptService.AzureOpenAIChatCompletion]:
    azureOpenAIChatCompletionSettingsDefinition,
};

interface Props {
  onOpenFunctionsModal: () => void;
}

export const ProviderSettingsCard = ({ onOpenFunctionsModal }: Props) => {
  const { form } = usePromptVersionEditorContext();
  const settings = Form.useWatch("settings", { form, preserve: true });
  const service = form.getFieldValue("service");

  if (!settings) {
    return null;
  }

  return (
    <>
      <ProviderSelector />
      {service && (
        <>
          <Divider />
          <ProviderSettingsSchemaRenderer
            schema={providerSettings[service].generateFormSchema(settings)}
          />
        </>
      )}
    </>
  );
};
