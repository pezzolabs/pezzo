import { Button, Modal, Typography } from "antd";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import { useNavigate } from "react-router-dom";
import { useDeletePromptMutation } from "../../graphql/hooks/mutations";
import { useEffect } from "react";
import { tr } from "date-fns/locale";
import { trackEvent } from "../../lib/utils/analytics";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const DeletePromptConfirmationModal = ({ open, onClose }: Props) => {
  const { project } = useCurrentProject();
  const { prompt } = useCurrentPrompt();
  const navigate = useNavigate();

  const { mutate, isSuccess } = useDeletePromptMutation();

  const handleDelete = () => {
    mutate(prompt.id);
    trackEvent("prompt_delete_confirmed");
  };

  const onCancel = () => {
    trackEvent("prompt_delete_cancelled");
    onClose();
  };

  useEffect(() => {
    if (!isSuccess) return;

    navigate(`/projects/${project.id}/prompts`);
  }, [isSuccess]);

  return (
    <Modal
      title="Delete prompt"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button danger type="primary" key="confirm" onClick={handleDelete}>
          Delete
        </Button>,
      ]}
    >
      <Typography.Paragraph>
        Are you sure you want to delete this prompt?
      </Typography.Paragraph>
    </Modal>
  );
};
