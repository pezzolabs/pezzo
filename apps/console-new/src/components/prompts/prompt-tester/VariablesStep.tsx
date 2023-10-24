import { Button, Form, Typography } from "antd";
import { usePromptVersionEditorContext } from "~/lib/providers/PromptVersionEditorContext";
import { usePromptTester } from "~/lib/providers/PromptTesterContext";
import { PromptVariables } from "./PromptVariables";

interface Props {
  onSubmit: () => void;
}

export const VariablesStep = ({ onSubmit }: Props) => {
  const { testVariablesForm, isTestLoading } = usePromptTester();
  const { variables } = usePromptVersionEditorContext();

  const initialValues = variables.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  return (
    <>
      <Typography.Title level={2}>Define Variables</Typography.Title>
      <Form
        disabled={isTestLoading}
        form={testVariablesForm}
        initialValues={initialValues}
      >
        <PromptVariables variables={initialValues} />
      </Form>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          htmlType="submit"
          type="primary"
          loading={isTestLoading}
          onClick={onSubmit}
        >
          Run Test
        </Button>
      </div>
    </>
  );
};
