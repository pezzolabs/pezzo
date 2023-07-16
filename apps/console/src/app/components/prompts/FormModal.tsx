import { Modal } from "antd";
import { FunctionsEditor } from "./FunctionsEditor";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const FunctionsFormModal = ({ open, onClose }: Props) => {
  return (
    <Modal
      title={`Edit Prompt Functions`}
      open={open}
      onCancel={onClose}
      footer={false}
      width={"700px"}
    >
      <FunctionsEditor onClose={onClose} />
    </Modal>
  );
};
