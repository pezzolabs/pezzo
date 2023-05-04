import { Button, Modal, Typography } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePromptConfirmationModal = ({
  open,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <Modal
      title="Delete prompt"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button danger type="primary" key="confirm" onClick={onConfirm}>
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
