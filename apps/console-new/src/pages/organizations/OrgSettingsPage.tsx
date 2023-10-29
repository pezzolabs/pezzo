import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { useMemo, useState } from "react";
import { useUpdateOrgSettingsMutation } from "~/graphql/hooks/mutations";
import { trackEvent } from "~/lib/utils/analytics";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle, SaveIcon } from "lucide-react";
import {
  Form,
  Alert,
  AlertTitle,
  AlertDescription,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Button,
} from "@pezzo/ui";

const formSchema = z.strictObject({
  orgName: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(64, "Name can't be longer than 64 characters"),
});

export const OrgSettingsPage = () => {
  const { organization } = useCurrentOrganization();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: organization?.name,
    },
  });

  const {
    mutate: updateSettings,
    error,
    isLoading,
  } = useUpdateOrgSettingsMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organization) return;

    updateSettings(
      { organizationId: organization?.id, name: values.orgName },
      {
        onSuccess: () => {
          form.reset({ orgName: values.orgName });
        },
      }
    );

    trackEvent("organization_settings_form_submitted");
  };

  if (!organization) return null;

  return (
    <div className="max-w-[640px]">
      <h1 className="flex-1 text-3xl font-semibold mb-2">
        Settings
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="orgName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your organization name"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            loading={isLoading}
            disabled={!form.formState.isDirty}
            type="submit"
          >
            <SaveIcon className="mr-2 h-4 w-4" /> Save
          </Button>
        </form>
      </Form>
    </div>
  );
};
