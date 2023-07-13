import { Button, Form, Select } from "antd";
import { PromptSettingsSlider } from "./PromptSettingsSlider";
import { generateSchema } from "../../lib/model-providers";
import { SendOutlined } from "@ant-design/icons";

interface Props {
  model: string;
  onOpenFunctionsModal: () => void;
}

export const PromptSettings = ({ model, onOpenFunctionsModal }: Props) => {
  const settingsSchema = generateSchema(model);

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
      {onOpenFunctionsModal && (
        <Button onClick={onOpenFunctionsModal} icon={<SendOutlined />}>
          Edit Functions
        </Button>
      )}
    </>
  );
};
