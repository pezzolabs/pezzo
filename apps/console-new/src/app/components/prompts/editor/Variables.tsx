import { Tag, Typography } from "antd";
import { usePromptVersionEditorContext } from "../../../lib/providers/PromptVersionEditorContext";

export const Variables = () => {
  const { variables } = usePromptVersionEditorContext();

  return (
    <>
      {variables.length === 0 && (
        <Typography.Text type="secondary">No variables found.</Typography.Text>
      )}

      {variables.map((key) => (
        <Tag key={key}>{key}</Tag>
      ))}
    </>
  );
};
