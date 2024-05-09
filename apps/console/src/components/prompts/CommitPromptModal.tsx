import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { useCreatePromptVersion } from "~/graphql/hooks/mutations";
import { trackEvent } from "~/lib/utils/analytics";
import { useEditorContext } from "~/lib/providers/EditorContext";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@pezzo/ui";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  open: boolean;
  onClose: () => void;
  onCommitted: () => void;
}

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message must be at least 1 character long")
    .max(120, "Message can't be longer than 64 characters"),
});

export const CommitPromptModal = ({ open, onClose, onCommitted }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const { prompt } = useCurrentPrompt();
  const { getForm: getEditorForm } = useEditorContext();
  const editorForm = getEditorForm();
  const { toast } = useToast();

  // fix open-source bug: no pass variable to watch
  const [service] = editorForm.watch([
    "service",
  ]);

  const { type, content, settings } = editorForm.getValues();

  const {
    mutate: createPromptVersion,
    error,
    isLoading,
  } = useCreatePromptVersion();

  const handleFormFinish = async (values: z.infer<typeof formSchema>) => {
    const data = {
      type,
      message: values.message,
      service: service,
      content,
      settings: settings || {},
      promptId: prompt.id,
    };

    createPromptVersion(data, {
      onSuccess: () => {
        form.reset();
        onCommitted();
        trackEvent("prompt_commit_submitted");
        toast({
          title: "Changes committed!",
          description: `Your commit has been created successfully.`,
        });
      },
    });
  };

  const handleCancel = () => {
    form.reset();
    onClose();
    trackEvent("prompt_commit_cancelled");
  };

  return (
    <Dialog open={open}>
      <DialogContent onPointerDownOutside={handleCancel}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormFinish)}>
            <DialogHeader className="mb-2">
              Commit Prompt - {prompt.name}
            </DialogHeader>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>
                  {error.response.errors[0].message}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commit message</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button loading={isLoading} type="submit">
                Commit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
