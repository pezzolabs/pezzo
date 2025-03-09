import { GetProjectsQuery } from "~/@generated/graphql/graphql";
import { useUpdateProjectSettingsMutation } from "../../graphql/hooks/mutations";
import { trackEvent } from "../../lib/utils/analytics";
import { useEffect } from "react";
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
} from "../../../../../libs/ui/src";
import { AlertCircle } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  projectName: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Name can't be longer than 100 characters")
    .regex(
      /^[a-zA-Z]+(?:[ ]+[a-zA-Z]+)*$/,
      "Name can only contain letters and spaces, e.g. My Project"
    ),
});

interface Props {
  projectToRename: GetProjectsQuery["projects"][0] | null;
  onClose: () => void;
}

export const RenameProjectModal = ({ projectToRename, onClose }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
    },
  });
  const { mutate: updateProjectSettings, error } =
    useUpdateProjectSettingsMutation();

  useEffect(() => {
    form.reset();
  }, [projectToRename, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProjectSettings(
      { projectId: projectToRename.id, name: values.projectName },
      {
        onSuccess: () => {
          trackEvent("project_rename_submitted");
          onClose();
        },
      }
    );
  };

  const onCancel = () => {
    trackEvent("project_rename_cancelled");
    onClose();
  };

  return (
    <Dialog open={!!projectToRename}>
      <DialogContent
        onPointerDownOutside={onCancel}
        className="sm:max-w-[425px]"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="mb-2">
                Rename project{" "}
                <span className="font-semibold">{projectToRename?.name}</span>
              </DialogTitle>
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
