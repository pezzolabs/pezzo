import { ProviderSelector } from "../../components/prompts/editor/ProviderSelector/ProviderSelector";
import { PromptService } from "@pezzo/types";
import { ProviderSettingsSchemaRenderer } from "../../components/prompts/editor/ProviderSettings/ProviderSettingsSchemaRenderer";
import { openAIChatCompletionSettingsDefinition } from "../../components/prompts/editor/ProviderSettings/providers/openai-chat-completion";
import { azureOpenAIChatCompletionSettingsDefinition } from "../../components/prompts/editor/ProviderSettings/providers/azure-openai-chat-completion";
import { useEditorContext } from "~/lib/providers/EditorContext";

const providerSettings = {
  [PromptService.OpenAIChatCompletion]: openAIChatCompletionSettingsDefinition,
  [PromptService.AzureOpenAIChatCompletion]:
    azureOpenAIChatCompletionSettingsDefinition,
};

interface Props {
}

export const ProviderSettingsCard = ({}: Props) => {
  const { getForm } = useEditorContext();

  const form = getForm();
  const settings = form.watch("settings");
  const service = form.watch("service");

  if (!settings) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <ProviderSelector />

      <div className="border-t my-2 border-muted"></div>

      {service && (
        <>
          <ProviderSettingsSchemaRenderer
            schema={providerSettings[service].generateFormSchema(settings)}
          />
        </>
      )}
    </div>
  );
};
