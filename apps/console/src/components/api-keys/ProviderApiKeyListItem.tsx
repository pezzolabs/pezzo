import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UPDATE_PROVIDER_API_KEY } from "~/graphql/definitions/mutations/api-keys";
import { gqlClient, queryClient } from "~/lib/graphql";
import { CreateProviderApiKeyInput } from "~/@generated/graphql/graphql";
import { useEffect } from "react";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { trackEvent } from "~/lib/utils/analytics";
import { providersList } from "./providers-list";
import { useDeleteProviderApiKeyMutation } from "~/graphql/hooks/mutations";
import {
  Card,
  Button,
  Form,
  FormField,
  FormItem,
  FormControl,
  Input,
  useToast,
} from "@pezzo/ui";
import { PencilIcon, SaveIcon, TrashIcon, XIcon } from "lucide-react";
import { GenericDestructiveConfirmationModal } from "../common/GenericDestructiveConfirmationModal";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  provider: string;
  value: string | null;
  onSave?: () => void;
  initialIsEditing?: boolean;
  canCancelEdit?: boolean;
}

const formSchema = z.strictObject({
  apiKey: z.string().min(1, "API Key must be at least 1 character long"),
});

export const ProviderApiKeyListItem = ({
  provider,
  value,
  onSave,
  initialIsEditing = false,
  canCancelEdit = true,
}: Props) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: value,
    },
  });

  const { currentOrgId } = useCurrentOrganization();
  const { mutate: deleteProviderApiKey } = useDeleteProviderApiKeyMutation();
  const [deletingProviderApiKey, setDeletingProviderApiKey] =
    useState<string>(null);
  const updateKeyMutation = useMutation({
    mutationFn: (data: CreateProviderApiKeyInput) =>
      gqlClient.request(UPDATE_PROVIDER_API_KEY, {
        data: {
          provider: data.provider,
          value: data.value,
          organizationId: data.organizationId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerApiKeys"] });
      onSave && onSave();
      setIsEditing(false);
      toast({
        title: "API key saved!",
        description: `The provider API key has been saved successfully.`,
      });
      form.reset();
    },
  });

  const handleDeleteProvider = async (provider: string) => {
    deleteProviderApiKey(
      { provider, organizationId: currentOrgId },
      {
        onSuccess: () => {
          trackEvent("provider_api_key_deleted", { provider });
          setDeletingProviderApiKey(null);
          toast({
            title: "API key deleted!",
            description: `The provider API key has been deleted successfully.`,
          });
          form.reset();
        },
      }
    );
  };

  const [isEditing, setIsEditing] = useState(initialIsEditing);

  useEffect(() => {
    form.reset();
  }, [isEditing, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateKeyMutation.mutate(
      {
        provider,
        value: values.apiKey,
        organizationId: currentOrgId,
      },
      {
        onSuccess: () => {
          trackEvent("provider_api_key_set", { provider });
          setIsEditing(false);
        },
      }
    );
  };

  const iconBase64 = providersList.find(
    (item) => item.provider === provider
  ).iconBase64;

  return (
    <>
      <GenericDestructiveConfirmationModal
        open={!!deletingProviderApiKey}
        title="Delete Provider API Key"
        description={`Are you sure you want to delete the API key for ${deletingProviderApiKey}?`}
        onConfirm={() => handleDeleteProvider(deletingProviderApiKey)}
        onCancel={() => setDeletingProviderApiKey(null)}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-4 p-2" key={value}>
            <div className="flex items-center gap-2">
              <img src={iconBase64} className="h-10 w-10 rounded-lg" />
              <div className="font-medium">{provider}</div>
              {isEditing ? (
                <div className="flex flex-1 justify-end opacity-50">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            placeholder="Your API key"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="flex flex-1 justify-end text-sm opacity-50">
                  {value || "No API key provided"}
                </div>
              )}
              {!isEditing && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              )}
              {isEditing && (
                <Button size="icon" type="submit">
                  <SaveIcon className="h-4 w-4" />
                </Button>
              )}
              {isEditing && canCancelEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
              {!isEditing && value && (
                <Button
                  size="icon"
                  variant="destructiveOutline"
                  onClick={() => setDeletingProviderApiKey(provider)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </form>
      </Form>
    </>
  );
};
