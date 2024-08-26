import {
  Card,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from "@pezzo/ui";
import { useEditorContext } from "~/lib/providers/EditorContext";

export const PromptEditMode = () => {
  const { getForm } = useEditorContext();
  const form = getForm();

  return (
    <div>
      <Card className="p-4 mb-6">
        <FormField
          control={form.control}
          name="content.prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="border-none"
                  placeholder="Type your prompt here"
                  autoCorrect="off"
                  disableAutoComplete
                  rows={12}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      </Card>
      <Card className="p-4">
        <FormField
          control={form.control}
          name="content.messages.0.content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="border-none"
                  placeholder="Type your system hint here"
                  autoCorrect="off"
                  disableAutoComplete
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      </Card>
      <Card className="p-4">
        <FormField
          control={form.control}
          name="content.messages.0.extra"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="border-none"
                  placeholder="Any other extra config you want to store. This will be also used within gen ai platform. Should be a valid json."
                  autoCorrect="off"
                  disableAutoComplete
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      </Card>
    </div>
  );
};
