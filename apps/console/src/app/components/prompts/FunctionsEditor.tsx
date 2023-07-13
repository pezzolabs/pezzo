import { Col, FormInstance, Row } from "antd";
import { PromptEditFormInputs } from "../../lib/hooks/usePromptEdit";
import { FormConfig, OnSubmit } from "@tutim/types";
import { TutimWizard, TutimProvider } from "@tutim/headless";
import { defaultFields } from "@tutim/fields";

interface Props {
  form: FormInstance<PromptEditFormInputs>;
  onClose: () => void;
}

const config: FormConfig = {
  fields: [
    {
      key: "functions",
      label: "Functions",
      type: "array",
      children: {
        fields: [
          {
            key: "name",
            label: "Function Name",
            type: "text",
            isRequired: true,
          },
          {
            key: "description",
            label: "Function Description",
            type: "text",
            isRequired: true,
          },
          {
            key: "parameters",
            label: "Parameters",
            type: "array",
            children: {
              fields: [
                {
                  key: "key",
                  label: "Key",
                  type: "text",
                  isRequired: true,
                },
                {
                  key: "type",
                  label: "Type",
                  type: "select",
                  isRequired: true,
                  defaultValue: "string",
                  options: [
                    { label: "String", value: "string" },
                    { label: "Number", value: "number" },
                    { label: "Boolean", value: "boolean" },
                    { label: "Object", value: "object" },
                    { label: "Array", value: "array" },
                  ],
                },
                {
                  key: "description",
                  label: "Description",
                  type: "text",
                },
                {
                  key: "required",
                  label: "Is Required?",
                  type: "checkbox",
                  helperText: "Check if required",
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const FunctionsForm = ({ data, onSubmit }): JSX.Element => {
  return (
    <TutimProvider fieldComponents={defaultFields}>
      <TutimWizard onSubmit={onSubmit} config={config} initialValues={data} />
    </TutimProvider>
  );
};

export const FunctionsEditor = ({ form, onClose }: Props) => {
  const functions = form.getFieldValue(["settings", "functions"]) || [];

  const data = functions.map(parseFromSchemaToFormData);
  const onSubmit: OnSubmit = ({ data }) => {
    const parsedFunctions = data.functions.map(parseFromFormDataToSchema);
    form.setFieldsValue({ settings: { functions: parsedFunctions } });
    onClose();
  };
  return (
    <Row style={{ background: "white", padding: "8px", color: "black" }}>
      <Col span={24}>
        <FunctionsForm data={{ functions: data }} onSubmit={onSubmit} />
      </Col>
    </Row>
  );
};

interface FunctionSchema {
  name: string;
  description: string;
  parameters: {
    key: string;
    type: string;
    description: string;
  }[];
}
interface FunctionForm {
  name: string;
  description: string;
  parameters: Record<
    string,
    {
      type: string;
      description: string;
    }
  >;
}

const mapArrWithKeyToObjByKey = <T extends { key: string }>(arr: T[]) => {
  return arr.reduce((acc, { key, ...rest }) => {
    acc[key] = rest;
    return acc;
  }, {});
};

const parseFromFormDataToSchema = (data: FunctionSchema) => {
  const parametersObject = mapArrWithKeyToObjByKey(data.parameters);
  return { ...data, parameters: parametersObject };
};

const parseFromSchemaToFormData = (data: FunctionForm) => {
  const parametersArray = Object.entries(data.parameters).map(
    ([key, value]) => ({ key, ...value })
  );
  return { ...data, parameters: parametersArray };
};
