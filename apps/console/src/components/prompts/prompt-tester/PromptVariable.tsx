import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@pezzo/ui";
import { Maximize2Icon, VariableIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { PromptTesterVariablesInputs } from "~/lib/providers/PromptTesterContext";

interface Props {
  name: string;
  value: string;
  field: ControllerRenderProps<PromptTesterVariablesInputs, `${string}`>;
}

export const PromptVariable = ({ name, value, field }: Props) => {
  return (
    <div className="flex">
      <div className="flex items-center justify-center gap-2 rounded-l-md bg-muted px-2">
        <VariableIcon className="h-4 w-4" />
        <span className="font-mono">{name}</span>
      </div>
      <Input className="rounded-none font-mono" {...field} />
      <div className="flex cursor-pointer items-center justify-center rounded-r-md bg-muted px-2">
        <Popover>
          <PopoverTrigger>
            <Maximize2Icon className="h-4 w-4 text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="min-w-[600px]">
            <Textarea
              className="font-mono"
              {...field}
              disableAutoComplete
              rows={6}
            ></Textarea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
