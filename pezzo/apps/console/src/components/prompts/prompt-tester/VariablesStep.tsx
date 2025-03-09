import {
  PromptTesterVariablesInputs,
  usePromptTester,
} from "../../../lib/providers/PromptTesterContext";
import { PromptVariables } from "./PromptVariables";
import { Button, DialogFooter, Form } from "../../../../../../libs/ui/src";
import { useWatch } from "react-hook-form";

interface Props {
  onSubmit: () => void;
}

export const VariablesStep = ({ onSubmit }: Props) => {
  const { testVariablesForm: form, isTestLoading } = usePromptTester();
  const testVariablesFormValues = useWatch({
    control: form.control,
  });

  const handleSubmit = (values: PromptTesterVariablesInputs) => {
    onSubmit();
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <PromptVariables form={form} variables={testVariablesFormValues} />
          <DialogFooter className="mt-6">
            <Button type="submit" loading={isTestLoading}>
              Run Test
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};
