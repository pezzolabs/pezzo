import { Space, Typography } from "antd";
import { PromptVariable } from "./PromptVariable";
import { isJson } from "~/lib/utils/is-json";

interface Props {
  variables: Record<string, string>;
}

export const PromptVariables = ({ variables }: Props) => {
  return (
    <>
      {Object.keys(variables).length === 0 && (
        <Typography.Text type="secondary">No variables found.</Typography.Text>
      )}

      <Space direction="vertical" style={{ width: "100%" }}>
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
            />
          ))}
      </Space>
    </>
  );
};
