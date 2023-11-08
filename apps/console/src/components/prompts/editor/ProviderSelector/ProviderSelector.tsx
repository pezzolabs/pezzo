import { sortRenderedProviders } from "./providers";
import { ProviderProps } from "./types";
import { PromptService } from "~/@generated/graphql/graphql";
import { useEditorContext } from "~/lib/providers/EditorContext";
import {
  FormControl,
  SelectContent,
  FormField,
  FormItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@pezzo/ui";

export const ProviderSelector = () => {
  const { getForm } = useEditorContext();
  const form = getForm();

  const settings = form.watch("settings");
  const providers = sortRenderedProviders(
    Object.keys(settings) as PromptService[]
  );

  const renderProvider = (provider: ProviderProps) => {
    const isAvailable = provider.value === PromptService.OpenAiChatCompletion;

    return (
      <SelectItem
        disabled={!isAvailable}
        key={provider.value}
        value={provider.value}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div>{provider.image}</div>
          <div className="flex-1 whitespace-nowrap">{provider.label}</div>
        </div>
      </SelectItem>
    );
  };

  return (
    <FormField
      control={form.control}
      name="service"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => renderProvider(provider))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
