import {
  Card,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from "pezzo/libs/ui/src";
import { useEditorContext } from "src/lib/providers/EditorContext";

export const PromptEditMode = () => {
  const { getForm } = useEditorContext();
  const form = getForm();

  return (
    <Card className="p-4">
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
  );
};
