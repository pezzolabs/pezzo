import { Alert, Modal } from "antd";
import { usePromptTester } from "~/lib/providers/PromptTesterContext";
import { VariablesStep } from "./VariablesStep";
import { RequestDetails } from "../../requests";
import { trackEvent } from "~/lib/utils/analytics";

export const PromptTesterModal = () => {
  const { isOpen, closeTestModal, runTest, testResult, testError } =
    usePromptTester();

  const handleSubmitVariables = async () => {
    runTest();
    trackEvent("prompt_test_submitted");
  };

  const handleCancel = () => {
    closeTestModal();
    trackEvent("prompt_test_cancelled");
  };

  return (
    <Modal
      onCancel={handleCancel}
      title="Prompt Tester"
      open={isOpen}
      footer={false}
    >
      {testError && (
        <Alert style={{ marginBottom: 12 }} type="error" message={testError} />
      )}

      {!testResult && <VariablesStep onSubmit={handleSubmitVariables} />}
      {testResult && (
        <RequestDetails
          id={testResult.reportId}
          request={testResult.request}
          response={testResult.response}
          provider={testResult.metadata.provider}
          calculated={testResult.calculated}
          metadata={testResult.metadata}
          properties={testResult.properties}
          cacheEnabled={testResult.cacheEnabled}
          cacheHit={testResult.cacheHit}
        />
      )}
    </Modal>
  );
};
