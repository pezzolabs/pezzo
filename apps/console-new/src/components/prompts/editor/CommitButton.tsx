import { SendOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { usePromptVersionEditorContext } from "~/lib/providers/PromptVersionEditorContext";

interface Props {
  onClick: () => void;
}

export const CommitButton = ({ onClick }: Props) => {
  const { hasChangesToCommit } = usePromptVersionEditorContext();

  return (
    <Button
      disabled={!hasChangesToCommit}
      onClick={onClick}
      icon={<SendOutlined />}
    >
      Commit
    </Button>
  );
};
