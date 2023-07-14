import { Form, Select } from "antd";
import styled from "@emotion/styled";
import { PromptSettingsSlider } from "../../PromptSettingsSlider";

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 8px;
`;

interface Props {
  schema: any[];
  baseFieldPath: string[];
}

export const ProviderSettingsSchemaRenderer = ({
  schema,
  baseFieldPath,
}: Props) => {
  return (
    <>
      {schema.map((field, index) => (
        <StyledFormItem
          key={index}
          label={field.label}
          name={[...baseFieldPath, field.name]}
        >
          {field.type === "select" && <Select options={field.options} />}
          {field.type === "slider" && (
            <PromptSettingsSlider
              min={field.min}
              max={field.max}
              step={field.step}
            />
          )}
        </StyledFormItem>
      ))}
    </>
  );
};
