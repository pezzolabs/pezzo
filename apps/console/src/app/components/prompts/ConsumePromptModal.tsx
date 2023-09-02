import { Modal, Tabs } from "antd";
import { TypeScriptOpenAIIntegrationTutorial } from "../getting-started-wizard";
import { useState } from "react";
import { PythonOpenAIIntegrationTutorial } from "../getting-started-wizard/PythonOpenAIIntegrationTutorial";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ConsumePromptModal = ({ open, onClose }: Props) => {
  const [tab, setTab] = useState("typescript");

  <TypeScriptOpenAIIntegrationTutorial />;

  const renderInsructions = () => {
    switch (tab) {
      case "typescript":
        return <TypeScriptOpenAIIntegrationTutorial />;
      case "python":
        return <PythonOpenAIIntegrationTutorial />;
    }
  };

  return (
    <Modal width={800} open={open} onCancel={onClose} footer={false}>
      <Tabs
        onChange={(key) => setTab(key)}
        defaultActiveKey="1"
        items={[
          {
            key: "typescript",
            label: "TypeScript",
          },
          {
            key: "python",
            label: "Python",
          },
        ]}
      />
      {renderInsructions()}
    </Modal>
  );
};
