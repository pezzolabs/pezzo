import {
  FormField,
  FormControl,
  FormItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormLabel,
} from "@pezzo/ui";
import { PromptSettingsSlider } from "../../PromptSettingsSlider";
import { useEditorContext } from "~/lib/providers/EditorContext";
import { GenerateFormSchema } from "./providers/openai-chat-completion";
import { SelectFormField, SliderFormField } from "./types";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface Props {
  schema: ReturnType<typeof GenerateFormSchema>;
}

export const ProviderSettingsSchemaRenderer = ({ schema }: Props) => {
  const { getForm } = useEditorContext();
  const form = getForm();
  // const setting = form.watch("settings");
  // const model = setting.model;

  const renderField = (
    renderSchema: any,
    field: ControllerRenderProps<FieldValues, any>
  ) => {
    switch (renderSchema.type) {
      case "select":
        return renderSelectField(renderSchema, field);
      case "slider":
        return renderSliderField(renderSchema, field);
    }
  };

  const renderSelectField = (
    renderSchema: SelectFormField,
    field: ControllerRenderProps<FieldValues, any>
  ) => {
    // console.log("field.value: ", field.value)
    renderSchema.options.map((option) => {
      if (option.value === field.value) {
        console.log("option.label: ", option.label)
      }
    });
    return (
      <Select defaultValue={field.value} onValueChange={field.onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {renderSchema.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const renderSliderField = (
    renderSchema: SliderFormField,
    field: ControllerRenderProps<FieldValues, any>
  ) => {
    return (
      <PromptSettingsSlider
        field={field}
        min={renderSchema.min}
        max={renderSchema.max}
        step={renderSchema.step}
      />
    );
  };

  return (
    <>
      {schema.map((renderSchema, index) => (
        <FormField
          key={renderSchema.name}
          control={form.control}
          name={`settings.${renderSchema.name}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{renderSchema.label}</FormLabel>
              <FormControl>{renderField(renderSchema, field)}</FormControl>
            </FormItem>
          )}
        />
      ))}
    </>
  );
};
