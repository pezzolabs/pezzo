import { Form, Select } from "antd";
import { PromptSettingsSlider } from "./PromptSettingsSlider";

export const PromptSettings = () => {
  return (
    <>
      <Form.Item
        label="Model"
        name={["settings", "model"]}
        style={{ marginBottom: 12 }}
      >
        <Select
          options={[
            {
              value: "gpt-3.5-turbo",
              label: "gpt-3.5-turbo",
            },
            {
              value: "gpt-4",
              label: "gpt-4",
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Temperature"
        name={["settings", "temperature"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={1} step={0.1} />
      </Form.Item>

      <Form.Item
        label="Maximum response tokens"
        name={["settings", "max_tokens"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={1} max={2048} step={1} />
      </Form.Item>

      <Form.Item
        label="Top P"
        name={["settings", "top_p"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={1} step={0.1} />
      </Form.Item>

      <Form.Item
        label="Frequency Penalty"
        name={["settings", "frequency_penalty"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={1} step={0.1} />
      </Form.Item>

      <Form.Item
        label="Presence Penalty"
        name={["settings", "presence_penalty"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={1} step={0.1} />
      </Form.Item>
    </>
  );
};
