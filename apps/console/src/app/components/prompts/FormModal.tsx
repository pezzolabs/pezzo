import { Modal, FormInstance } from "antd";
import { PromptEditFormInputs } from "../../lib/hooks/usePromptEdit";
import { FunctionsEditor } from "./FunctionsEditor";

interface Props {
  open: boolean;
  onClose: () => void;
  form: FormInstance<PromptEditFormInputs>;
}

export const FunctionsFormModal = ({ open, onClose, form }: Props) => {
  return (
    <Modal
      title={`Edit Prompt Functions`}
      open={open}
      onCancel={onClose}
      footer={false}
      width={"80%"}
    >
      <FunctionsEditor form={form} onClose={onClose} />
    </Modal>
  );
};
