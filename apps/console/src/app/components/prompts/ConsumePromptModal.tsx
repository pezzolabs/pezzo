import { Modal } from "antd";
import { TypeScriptOpenAIIntegrationTutorial } from "../getting-started-wizard";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ConsumePromptModal = ({ open, onClose }: Props) => {
  return (
    <Modal width={800} open={open} onCancel={onClose} footer={false}>
      <TypeScriptOpenAIIntegrationTutorial />
    </Modal>
  );
};
