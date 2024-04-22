import { useEditorContext } from "~/lib/providers/EditorContext";
import { usePromptTester } from "~/lib/providers/PromptTesterContext";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Form,
  FormField,
  Tabs,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pezzo/ui";
import { PromptEditMode } from "./PromptEditMode";
import { PromptType } from "~/@generated/graphql/graphql";
import { useState } from "react";
import { ProviderSettingsCard } from "./ProviderSettingsCard";
import {
  BugPlayIcon,
  InfoIcon,
  SendHorizonalIcon,
  TerminalIcon,
} from "lucide-react";
import { Variables } from "./Variables";
import { Tag } from "~/components/common/Tag";
import { PromptVersionSelector } from "~/components/prompts/PromptVersionSelector";
import { CommitButton } from "./CommitButton";
import { trackEvent } from "~/lib/utils/analytics";
import { useProviderApiKeys } from "~/graphql/hooks/queries";
import { useRequiredProviderApiKeyModal } from "~/lib/providers/RequiredProviderApiKeyModalProvider";
import { PromptTesterModal } from "~/components/prompts/prompt-tester/PromptTesterModal";
import { ConsumePromptModal } from "~/components/prompts/ConsumePromptModal";
import { CommitPromptModal } from "~/components/prompts/CommitPromptModal";
import { PublishPromptModal } from "~/components/prompts/PublishPromptModal";
import { ChatEditMode } from "~/components/prompts/editor/chat/ChatEditMode";
import { useWatch } from "react-hook-form";

export const PromptEditView = () => {
  const {
    getForm,
    isDraft,
    handleTypeChange,
    isPublishEnabled,
    currentVersionSha,
  } = useEditorContext();
  const { providerApiKeys } = useProviderApiKeys();
  const { openRequiredProviderApiKeyModal } = useRequiredProviderApiKeyModal();

  const form = getForm();
  const [type] = useWatch({
    control: form.control,
    name: ["type"],
  });

  const { openTestModal } = usePromptTester();

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isConsumePromptModalOpen, setIsConsumePromptModalOpen] =
    useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const handleRunTest = () => {
    const provider = "OpenAI";
    const hasProviderApiKey = !!providerApiKeys.find(
      (key) => key.provider === provider
    );

    trackEvent("prompt_run_test_clicked");
    const values = form.getValues();

    // TODO: remove RequiredProviderApiKeyModal if don't need open AI key in the future
    if (!hasProviderApiKey) {
      openRequiredProviderApiKeyModal({
        callback: () => {
          openTestModal(values);
        },
        provider,
        reason: "prompt_tester",
      });
      return;
    }

    openTestModal(values);
  };

  const handleHowToConsumeClick = () => {
    setIsConsumePromptModalOpen(true);
    trackEvent("prompt_how_to_consume_modal_opened");
  };

  const handlePublishClick = () => {
    setIsPublishModalOpen(true);
    trackEvent("prompt_publish_modal_opened");
  };

  const handleCommitClick = () => {
    setIsCommitModalOpen(true);
    trackEvent("prompt_commit_modal_opened");
  };

  return (
    <>
      <div className="p-6">
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              {isDraft ? <Tag>Draft</Tag> : <PromptVersionSelector />}
              <FormField
                name="type"
                render={({ field }) => (
                  <Tabs
                    className="flex flex-1 justify-center"
                    value={field.value}
                    onValueChange={handleTypeChange}
                  >
                    <TabsList>
                      <TabsTrigger value={PromptType.Chat}>Chat</TabsTrigger>
                      <TabsTrigger value={PromptType.Prompt}>
                        Prompt
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              />
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={handleRunTest}>
                  <BugPlayIcon className="mr-2 h-4 w-4" />
                  Test
                </Button>
                {isPublishEnabled && (
                  <Button variant="outline" onClick={handleHowToConsumeClick}>
                    <TerminalIcon className="mr-2 h-4 w-4" />
                    How to consume
                  </Button>
                )}
                {isPublishEnabled && (
                  <Button onClick={handlePublishClick}>
                    <SendHorizonalIcon className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                )}
                <CommitButton onClick={handleCommitClick} />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7 md:col-span-8 lg:col-span-9">
                {type === PromptType.Prompt && <PromptEditMode />}
                {type === PromptType.Chat && <ChatEditMode />}
              </div>
              <div className="col-span-5 flex flex-col gap-4 md:col-span-4 lg:col-span-3">
                <Card className="flex flex-col gap-4 border">
                  <CardHeader className="border-b border-muted p-4 font-semibold">
                    Settings
                  </CardHeader>
                  <CardContent>
                    <ProviderSettingsCard />
                  </CardContent>
                </Card>

                <Card className="flex flex-col gap-4 border">
                  <CardHeader className="border-b border-muted p-4">
                    <div className="flex w-full items-center justify-between">
                      <p className="font-semibold">Variables</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              You can specify variables using curly braces. For
                              example - {`{someVariable}`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Variables />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Form>
      </div>

      <PromptTesterModal />

      <ConsumePromptModal
        open={isConsumePromptModalOpen}
        onClose={() => setIsConsumePromptModalOpen(false)}
      />

      <CommitPromptModal
        open={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        onCommitted={() => {
          setIsCommitModalOpen(false);
        }}
      />
      {currentVersionSha && (
        <PublishPromptModal
          onClose={() => setIsPublishModalOpen(false)}
          open={isPublishModalOpen}
        />
      )}
    </>
  );
};
