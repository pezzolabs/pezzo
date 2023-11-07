import { usePromptTester } from "~/lib/providers/PromptTesterContext";
import { VariablesStep } from "./VariablesStep";
import { RequestDetails } from "../../requests";
import { trackEvent } from "~/lib/utils/analytics";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@pezzo/ui";
import { AlertCircle } from "lucide-react";
import { cn } from "@pezzo/ui/utils";

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
    <Dialog open={isOpen}>
      <DialogContent
        onPointerDownOutside={closeTestModal}
        className={cn({
          "max-w-3xl": testResult,
        })}
      >
        <DialogHeader>
          <DialogTitle>Prompt Tester</DialogTitle>
        </DialogHeader>
        <div>
          {testError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>
                {testError.response.errors[0].message}
              </AlertDescription>
            </Alert>
          )}
          {!testResult && <VariablesStep onSubmit={handleSubmitVariables} />}
          {testResult && (
            <div className="w-full">
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
              </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
