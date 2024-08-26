import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { PromptService, PromptType } from "~/@generated/graphql/graphql";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getServiceDefaultSettings } from "~/components/prompts/editor/ProviderSettings/providers";
import { useCurrentPrompt } from "./CurrentPromptContext";
import { useGetPromptVersion } from "~/graphql/hooks/queries";
import { findVariables } from "../utils/find-variables";

const getDefaultContent = (type: PromptType) => {
  switch (type) {
    case PromptType.Prompt:
      return { prompt: "" };
    case PromptType.Chat:
      return {
        messages: [
          {
            role: "user",
            content: "",
            extra: "",
          },
        ],
      };
  }
};

const formSchema = z.object({
  type: z.nativeEnum(PromptType).default(PromptType.Chat),
  service: z.nativeEnum(PromptService),
  settings: z.any(),
  content: z.union([
    z.object({
      prompt: z.string().min(1, "Prompt content is required"),
    }),
    z.object({
      messages: z.array(
        z.object({
          content: z.string().min(1, "Message content is required"),
          role: z.enum(["user", "assistant", "system"]),
          extra: z.any()
        })
      ),
    }),
  ]),
});

export type EditorFormInputs = z.infer<typeof formSchema>;

interface EditorContext {
  getForm: () => UseFormReturn<EditorFormInputs>;
  messagesArray: UseFieldArrayReturn<EditorFormInputs>;
  variables: string[];
  isDraft: boolean;
  currentVersionSha: string;
  setCurrentVersionSha: (sha: string) => void;
  isPublishEnabled: boolean;
  hasChangesToCommit: boolean;
  handleTypeChange: (type: PromptType) => void;
}

const EditorContext = createContext<EditorContext>(null);

export const useEditorContext = () => {
  return useContext(EditorContext);
};

export const EditorProvider = ({ children }) => {
  const { prompt } = useCurrentPrompt();
  const initialValues = useRef<EditorFormInputs>(undefined);
  const [currentVersionSha, setCurrentVersionSha] = useState<string>(
    prompt?.latestVersion?.sha
  );
  const { promptVersion: currentVersion, isFetched } = useGetPromptVersion(
    { promptId: prompt?.id, promptVersionSha: currentVersionSha },
    {
      enabled: !!prompt && !!currentVersionSha,
    }
  );

  const isDraft = useMemo(
    () => !prompt?.latestVersion,
    [prompt?.latestVersion]
  );

  const form = useForm<EditorFormInputs>({
    resolver: zodResolver(formSchema),
  });

  const messagesArray = useFieldArray<EditorFormInputs>({
    control: form.control,
    name: "content.messages",
  });

  const [type, promptContent, chatContent] = useWatch({
    control: form.control,
    name: ["type", "content.prompt", "content.messages"],
  });

  const handleTypeChange = (type: PromptType) => {
    form.setValue("type", type, { shouldDirty: true, shouldTouch: true });
    let content: EditorFormInputs["content"];

    if (type === PromptType.Chat) {
      const promptContent = form.getValues("content.prompt");
      const promptExtra = form.getValues("content.messages.0.extra");
      content = {
        messages: [
          {
            role: "user",
            content: promptContent ?? "",
            extra: promptExtra ?? "",
          },
        ],
      };

      form.setValue("content.messages", content.messages);
    } else if (type === PromptType.Prompt) {
      const firstMessageContent = form.getValues("content.messages.0.content");
      content = {
        prompt: firstMessageContent ?? "",
      };

      form.setValue("content.prompt", content.prompt);
    }
  };

  const variables =
    useMemo(() => {
      if (type === PromptType.Prompt && promptContent) {
        const variables = findVariables(promptContent);
        return [...new Set(variables)];
      } else if (type === PromptType.Chat && chatContent) {
        let variables = [];
        chatContent
          .filter((message) => !!message)
          .forEach((message) => {
            const foundVariables = findVariables(message?.content);
            if (message?.content) variables = [...variables, ...foundVariables];
          });

        return [...new Set(variables)];
      }
    }, [promptContent, chatContent, type]) ?? [];

  useEffect(() => {
    if (isDraft) {
      const service = PromptService.OpenAiChatCompletion;
      const settings = getServiceDefaultSettings(service);

      form.reset({
        service,
        settings,
        // use prompt type as default
        content: getDefaultContent(PromptType.Prompt),
        type: PromptType.Prompt,
      });
    }

    if (isFetched && currentVersion) {
      // console.log("currentSetting: " + JSON.stringify(currentVersion.settings));
      form.reset({
        service: currentVersion.service,
        settings: currentVersion.settings,
        content: currentVersion.content,
        type: currentVersion.type,
      });
    }

    form.reset(initialValues.current);
  }, [currentVersion, isFetched, prompt, isDraft]);

  const getForm = () => form;

  return (
    <EditorContext.Provider
      value={{
        getForm,
        messagesArray,
        variables,
        isDraft,
        isPublishEnabled: !isDraft,
        currentVersionSha,
        setCurrentVersionSha,
        hasChangesToCommit: form.formState.isDirty,
        handleTypeChange,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
