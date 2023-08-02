import { Modal } from "antd";
import { usePromptTester } from "../../../lib/providers/PromptTesterContext";
import { useState } from "react";
import { VariablesStep } from "./VariablesStep";
import { RequestDetails } from "../../requests";

enum Step {
  DEFINE_VARIABLES = "DEFINE_VARIABLES",
  VIEW_RESULTS = "VIEW_RESULTS",
}

export const PromptTesterModal = () => {
  const { isOpen, closeTestModal, runTest, testResult } = usePromptTester();
  const [step, setStep] = useState<Step>(Step.DEFINE_VARIABLES);

  const handleSubmitVariables = async () => {
    await runTest();
    setStep(Step.VIEW_RESULTS);
  };

  const handleCancel = () => {
    setStep(Step.DEFINE_VARIABLES);
    closeTestModal();
  };

  return (
    <Modal
      onCancel={handleCancel}
      title="Prompt Tester"
      open={isOpen}
      footer={false}
    >
      {step === Step.DEFINE_VARIABLES && (
        <VariablesStep onSubmit={handleSubmitVariables} />
      )}
      {step === Step.VIEW_RESULTS && (
        <RequestDetails
          id={testResult.reportId}
          request={testResult.request}
          response={testResult.response}
          provider={testResult.metadata.provider}
          calculated={testResult.calculated}
          metadata={testResult.metadata}
          properties={testResult.properties}
        />
      )}
    </Modal>
  );
};
