import { usePromptTester } from "../../../lib/providers/PromptTesterContext";
import { VariablesStep } from "./VariablesStep";
import { RequestDetails } from "../../requests";
import { trackEvent } from "../../../lib/utils/analytics";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
} from "../../../../../../libs/ui/src";
import { AlertCircle } from "lucide-react";
import { cn } from "../../../../../../libs/ui/src/utils";

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
        onPointerDownOutside={handleCancel}
        className={cn("p-0", {
          "max-w-3xl": testResult,
        })}
      >
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
              <RequestDetails id={testResult.id} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
