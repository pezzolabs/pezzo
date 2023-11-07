import { useMutation } from "@tanstack/react-query";
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
import { gqlClient, queryClient } from "~/lib/graphql";
import { CREATE_ENVIRONMENT } from "~/graphql/definitions/mutations/environments";
import { CreateEnvironmentMutation } from "~/@generated/graphql/graphql";
import { GraphQLErrorResponse } from "~/graphql/types";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { trackEvent } from "~/lib/utils/analytics";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

const formSchema = z.object({
  environmentName: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(64, "Name can't be longer than 64 characters"),
});

export const CreateEnvironmentModal = ({ open, onClose, onCreated }: Props) => {
  const { projectId } = useCurrentProject();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      environmentName: "",
    },
  });

  const { mutate, error } = useMutation<
    CreateEnvironmentMutation,
    GraphQLErrorResponse,
    z.infer<typeof formSchema>
  >({
    mutationFn: (data) =>
      gqlClient.request(CREATE_ENVIRONMENT, {
        data: {
          name: data.environmentName,
          projectId,
        },
      }),
    onSuccess: (data) => {
      onCreated(data.createEnvironment.name);
      queryClient.invalidateQueries({ queryKey: ["environments"] });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
    form.reset();
    trackEvent("environment_form_submitted");
  };

  const onCancel = () => {
    onClose();
    form.reset();
    trackEvent("environment_form_cancelled");
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
              <DialogTitle className="mb-2">New Environment</DialogTitle>
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
                  name="environmentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment name</FormLabel>
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
