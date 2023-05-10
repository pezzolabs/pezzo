import { Form, Select } from "antd";
import { PromptSettingsSlider } from "../../PromptSettingsSlider";

export const Settings = () => {
  return (
    <>
      <Form.Item
        label="Model"
        name={["settings", "model"]}
        style={{ marginBottom: 12 }}
      >
        <Select
          defaultValue={"j2-jumbo-instruct"}
          options={[
            {
              value: "j2-jumbo-instruct",
              label: "j2-jumbo-instruct",
            },
            {
              value: "j2-grande-instruct",
              label: "j2-grande-instruct",
            },
            {
              value: "j2-jumbo",
              label: "j2-jumbo",
            },
            {
              value: "j2-grande",
              label: "j2-grande",
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Max completion length"
        name={["settings", "modelSettings", "maxTokens"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={1} max={8191} step={1} />
      </Form.Item>

      <Form.Item
        label="Temperature"
        name={["settings", "modelSettings", "temperature"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={1} step={0.1} />
      </Form.Item>

      <Form.Item
        label="Top P"
        name={["settings", "modelSettings", "topP"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={1} step={0.1} />
      </Form.Item>

      <Form.Item
        label="Presence Penalty"
        name={["settings", "modelSettings", "presencePenalty", "scale"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={5} step={0.1} />
      </Form.Item>

      <Form.Item
        label="Count Penalty"
        name={["settings", "modelSettings", "countPenalty", "scale"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={1} step={0.1} />
      </Form.Item>

      <Form.Item
        label="Frequency Penalty"
        name={["settings", "modelSettings", "frequencyPenalty", "scale"]}
        style={{ marginBottom: 8 }}
      >
        <PromptSettingsSlider min={0} max={500} step={1} />
      </Form.Item>
    </>
  );
};
