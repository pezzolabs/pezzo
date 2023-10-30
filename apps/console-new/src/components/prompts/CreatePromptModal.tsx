import { useMutation } from "@tanstack/react-query";
import { CREATE_PROMPT } from "~/graphql/definitions/mutations/prompts";
import { gqlClient, queryClient } from "~/lib/graphql";
import { CreatePromptMutation } from "~/@generated/graphql/graphql";
import { GraphQLErrorResponse } from "~/graphql/types";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { trackEvent } from "~/lib/utils/analytics";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Form,
  FormItem,
  FormControl,
  Input,
  FormField,
  FormMessage,
  FormLabel,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@pezzo/ui";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

const formSchema = z.object({
  promptName: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Name can't be longer than 64 characters"),
});

export const CreatePromptModal = ({ open, onClose, onCreated }: Props) => {
  const { project } = useCurrentProject();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptName: "",
    },
  });

  const { mutate, error } = useMutation<
    CreatePromptMutation,
    GraphQLErrorResponse,
    z.infer<typeof formSchema>
  >({
    mutationFn: (data) =>
      gqlClient.request(CREATE_PROMPT, {
        data: {
          name: data.promptName,
          projectId: project.id,
        },
      }),
    onSuccess: (data) => {
      onCreated(data.createPrompt.id);
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      trackEvent("prompt_created", {
        promptId: data.createPrompt.id,
      });
      navigate(`/projects/${project.id}/prompts/${data.createPrompt.id}`)
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data);
    form.reset();
    trackEvent("prompt_form_submitted");
  };

  const onCancel = () => {
    trackEvent("prompt_form_cancelled");
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onPointerDownOutside={onCancel}
        className="sm:max-w-[425px]"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="mb-2">New Prompt</DialogTitle>
              <DialogDescription>
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
                  name="promptName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt name</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
