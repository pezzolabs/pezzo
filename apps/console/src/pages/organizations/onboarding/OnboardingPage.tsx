import { useNavigate } from "react-router-dom";
import { useGetProjects } from "~/graphql/hooks/queries";
import {
  useCreateProjectMutation,
  useUpdateCurrentUserMutation,
} from "~/graphql/hooks/mutations";
import { useCallback, useEffect } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateProjectMutation,
  UpdateProfileMutation,
} from "~/@generated/graphql/graphql";
import { useAuthContext } from "~/lib/providers/AuthProvider";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@pezzo/ui";

const formSchema = z.object({
  projectName: z
    .string()
    .min(1, "Please enter a valid project name")
    .max(100, "Project name must be less than 100 characters"),
});

export const OnboardingPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
    },
  });

  const { organization } = useCurrentOrganization();
  const { mutateAsync: updateCurrentUser, isLoading: isUpdatingUserLoading } =
    useUpdateCurrentUserMutation();
  const { mutateAsync: createProject, isLoading: isProjectCreationLoading } =
    useCreateProjectMutation();
  usePageTitle("Onboarding");
  const { projects, isLoading: isProjectsLoading } = useGetProjects();

  const { currentUser } = useAuthContext();

  const navigate = useNavigate();

  const isCreatingProject = isProjectCreationLoading || isUpdatingUserLoading;
  const hasName = currentUser.name !== null;

  const handleCreateProject = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const actions: [
        Promise<CreateProjectMutation>,
        Promise<UpdateProfileMutation | null>
      ] = [
        createProject({
          name: values.projectName,
          organizationId: organization?.id,
        }),
        null,
      ];

      await Promise.all(actions.filter(Boolean));
      return navigate("/");
    },
    [createProject, organization?.id, navigate]
  );

  useEffect(() => {
    if (projects && projects.length > 0) {
      navigate("/projects", { replace: true });
    }
  }, [projects, navigate]);

  return (
    <div className="mt-6 flex items-center justify-center">
      <Card>
        <CardContent>
          <CardHeader>
            <h3>Let's create your first project 🎉</h3>
          </CardHeader>
          <div>
            <Form {...form}>
              <FormField
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      How do you want to call your first project?
                    </FormLabel>
                    <Input autoComplete="off" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={form.handleSubmit(handleCreateProject)}
            loading={isCreatingProject}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
