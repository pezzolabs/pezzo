import { useEnvironments } from "../../lib/hooks/useEnvironments";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { gqlClient, queryClient } from "../../lib/graphql";
import { PUBLISH_PROMPT } from "../../graphql/definitions/mutations/prompt-environments";
import {
  PublishPromptInput,
  PublishPromptMutation,
} from "~/@generated/graphql/graphql";
import { trackEvent } from "../../lib/utils/analytics";
import { useEditorContext } from "../../lib/providers/EditorContext";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  useToast,
} from "../../../../../libs/ui/src";
import { AlertCircle, CheckSquare, Square } from "lucide-react";
import { GraphQLErrorResponse } from "../../graphql/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const PublishPromptModal = ({ open, onClose }: Props) => {
  const { currentVersionSha } = useEditorContext();
  const { prompt } = useCurrentPrompt();
  const { environments } = useEnvironments();
  const [selectedEnvironmentId, setSelectedEnvironmentId] =
    useState<string>(undefined);
  const { toast } = useToast();

  const {
    mutate: publishPrompt,
    error,
    isLoading,
  } = useMutation<
    PublishPromptMutation,
    GraphQLErrorResponse,
    PublishPromptInput
  >({
    mutationFn: (data: PublishPromptInput) =>
      gqlClient.request(PUBLISH_PROMPT, { data }),
    mutationKey: ["publishPrompt", prompt.id, currentVersionSha],
    onSuccess: () => {
      queryClient.invalidateQueries(["promptEnvironments"]);
    },
  });

  const handlePublish = async () => {
    publishPrompt(
      {
        promptId: prompt.id,
        environmentId: selectedEnvironmentId,
        promptVersionSha: currentVersionSha,
      },
      {
        onSuccess: () => {
          toast({
            title: "Prompt published!",
            description: `Your prompt has been published successfully.`,
          });
          onClose();
        },
      }
    );
    trackEvent("prompt_publish_clicked");
  };

  useEffect(() => {
    setSelectedEnvironmentId(undefined);
  }, [open]);

  const handleEnvironmentClick = (environmentId: string) => {
    setSelectedEnvironmentId(environmentId);
  };

  return (
    environments && (
      <Dialog open={open}>
        <DialogContent onPointerDownOutside={() => onClose()}>
          <DialogHeader>Publish Prompt - {prompt.name}</DialogHeader>
          <div className="flex flex-col gap-2">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>
                  {error.response.errors[0].message}
                </AlertDescription>
              </Alert>
            )}

            <p className="text-sm">
              Select the environment to publish this version to.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {environments.map((environment) => (
              <Card
                onClick={() => handleEnvironmentClick(environment.id)}
                className="flex cursor-pointer items-center justify-between border border-card p-4 hover:border-primary"
              >
                <div className="font-medium">{environment.name}</div>
                <div>
                  {selectedEnvironmentId === environment.id && (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  )}
                  {selectedEnvironmentId !== environment.id && (
                    <Square className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button
              loading={isLoading}
              disabled={selectedEnvironmentId === undefined}
              onClick={handlePublish}
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
};
