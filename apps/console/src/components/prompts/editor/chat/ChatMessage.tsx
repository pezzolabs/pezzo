import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { trackEvent } from "~/lib/utils/analytics";
import {
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from "@pezzo/ui";
import {
  ArrowDownUpIcon,
  BotIcon,
  GripVertical,
  LucideIcon,
  TrashIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";
import { useEditorContext } from "~/lib/providers/EditorContext";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

interface Props {
  index: number;
  canDelete?: boolean;
  onDelete: () => void;
}

type role = "system" | "user" | "assistant";

const roleOptions: {
  label: string;
  value: role;
  icon: LucideIcon;
}[] = [
  { label: "System", value: "system", icon: WrenchIcon },
  { label: "User", value: "user", icon: UserIcon },
  // { label: "Assistant", value: "assistant", icon: BotIcon },
];

export const ChatMessage = ({ index, canDelete = true, onDelete }: Props) => {
  const { promptId } = useCurrentPrompt();
  const { getForm } = useEditorContext();
  const form = getForm();
  const message = useWatch({
    control: form.control,
    name: `content.messages.${index}`,
  });

  const currentRole = useMemo(
    () => roleOptions.find((roleOption) => message?.role === roleOption.value),
    [message?.role]
  );

  if (!message) {
    return null;
  }

  const handleRoleChange = (role: "system" | "user" | "assistant") => {
    form.setValue(`content.messages.${index}.role`, role, {
      shouldDirty: true,
    });
    trackEvent("prompt_chat_completion_message_role_changed", {
      promptId,
      role,
    });
  };

  return (
    <Card className="flex flex-col gap-4 border">
      <div className="group flex h-14 items-center justify-start border-b border-muted px-4 py-2 font-medium">
        <GripVertical className="-mt-[3px] mr-[2px] h-4 w-4 text-muted-foreground" />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="inline-flex items-center gap-2">
              <ArrowDownUpIcon className="h-4 w-4 text-muted-foreground" />
              <span>{currentRole.label}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {roleOptions.map((role) => (
              <DropdownMenuItem
                key={role.value}
                onClick={() => handleRoleChange(role.value)}
              >
                <role.icon className="mr-2 h-4 w-4" />
                <span>{role.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {canDelete && (
          <TrashIcon
            onClick={onDelete}
            className="ml-auto hidden h-4 w-4 cursor-pointer text-destructive group-hover:inline-flex"
          />
        )}
      </div>
      <CardContent className="">
        <FormField
          control={form.control}
          name={`content.messages.${index}.content`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="border-none"
                  placeholder="Type your message here"
                  autoCorrect="off"
                  disableAutoComplete
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
