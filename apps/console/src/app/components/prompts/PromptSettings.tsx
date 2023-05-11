import { getIntegration } from "@pezzo/integrations";
import { Form, Select } from "antd";
import { PromptSettingsSlider } from "./PromptSettingsSlider";

interface Props {
  integrationId: string;
}

export const PromptSettings = ({ integrationId }: Props) => {
  const settingsSchema = getIntegration(integrationId).settingsSchema;

  const commonStyle = {
    marginBottom: 8,
  };

  return (
    <>
      {settingsSchema.map((field, index) => (
        <Form.Item
          key={index}
          label={field.label}
          name={field.name}
          style={commonStyle}
        >
          {field.type === "select" && (
            <Select defaultValue={field.defaultValue} options={field.options} />
          )}
          {field.type === "slider" && (
            <PromptSettingsSlider
              min={field.min}
              max={field.max}
              step={field.step}
            />
          )}
        </Form.Item>
      ))}
    </>
  );
};
