import { Space, Tag, Tooltip, Typography } from "antd";

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

      <Space direction="horizontal">
        {Object.keys(variables).length > 0 &&
          Object.keys(variables).map((variableName) => (
            <Tooltip
              key={variableName}
              title="Click to edit"
              placement="bottomLeft"
            >
              <Tag style={{ cursor: "pointer" }} key={variableName}>
                {variableName}
              </Tag>
            </Tooltip>
          ))}
      </Space>
    </div>
  );
};
