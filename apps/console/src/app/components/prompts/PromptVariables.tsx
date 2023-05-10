import { Space, Typography } from "antd";
import { PromptVariable } from "./PromptVariable";
import { isJson } from "../../lib/utils/is-json";

interface Props {
  variables: Record<string, string>;
  onVariableChange: (name: string, value: string) => void;
}

export const PromptVariables = ({ variables, onVariableChange }: Props) => {
  return (
    <div>
      {Object.keys(variables).length === 0 && (
        <Typography.Text type="secondary">No variables found.</Typography.Text>
      )}

      <Space direction="vertical">
        {Object.keys(variables).length > 0 &&
          Object.keys(variables).map((variableName) => (
            <PromptVariable
              key={variableName}
              name={variableName}
              value={
                isJson(variables[variableName])
                  ? JSON.stringify(JSON.parse(variables[variableName]), null, 2)
                  : variables[variableName]
              }
              onChange={(value) => onVariableChange(variableName, value)}
            />
          ))}
      </Space>
    </div>
  );
};
