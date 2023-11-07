import { useCreateProjectMutation } from "~/graphql/hooks/mutations";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { trackEvent } from "~/lib/utils/analytics";
import { useNavigate } from "react-router-dom";
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
import { AlertCircle } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  projectName: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Name can't be longer than 100 characters"),
});

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateNewProjectModal = ({ open, onClose }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
    },
  });
  const { organizationId } = useCurrentOrganization();
  const navigate = useNavigate();
  const { mutateAsync: createProject, error } = useCreateProjectMutation({
    onSuccess: () => {
      form.reset();
      onClose();
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createProject(
      {
        name: values.projectName,
        organizationId,
      },
      {
        onSuccess: (data) => {
          onClose();
          navigate(`/projects/${data.createProject.id}`);
        },
      }
    );

    trackEvent("project_form_submitted");
  };

  const onCancel = () => {
    onClose();
    trackEvent("project_form_cancelled");
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
              <DialogTitle className="mb-2">New Project</DialogTitle>
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
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project name</FormLabel>
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
