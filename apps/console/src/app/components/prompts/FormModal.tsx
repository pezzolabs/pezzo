import { Modal, FormInstance } from "antd";
import { useState } from "react";
import { PromptEditFormInputs } from "../../lib/hooks/usePromptEdit";
import { FunctionsEditor } from "./FunctionsEditor";

interface Props {
  open: boolean;
  onClose: () => void;
  form: FormInstance<PromptEditFormInputs>;
}

export const FunctionsFormModal = ({ open, onClose, form }: Props) => {
  const [formVersion, setFormVersion] = useState(0);
  const initialFunctions = form.getFieldValue(["settings", "functions"]) || [];

  const handleDeleteMessage = (deletedIndex: number) => {
    const updatedSettings = form.getFieldValue("settings");
    form.setFieldValue(
      ["settings", "functions"],
      updatedSettings.functions.filter(
        (_, funcIndex) => funcIndex !== deletedIndex
      )
    );
    setFormVersion((prev) => prev + 1);
  };

  const handleAddMessage = () => {
    const { functions = [] } = form.getFieldValue("settings");
    form.setFieldValue(
      ["settings", "functions"],
      [...functions, { name: `function_${functions.length + 1}` }]
    );
    setFormVersion((prev) => prev + 1);
  };

  return (
    <Modal
      title={`Edit Prompt Functions`}
      open={open}
      onCancel={onClose}
      footer={false}
    >
      <FunctionsEditor
        form={form}
        onDeleteMessage={handleDeleteMessage}
        onNewMessage={handleAddMessage}
        functions={initialFunctions}
        key={`functions-editor-${formVersion}`}
      />
    </Modal>
  );
};
