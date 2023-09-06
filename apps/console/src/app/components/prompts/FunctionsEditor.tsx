import { Col, Form, Row } from "antd";
import { FormConfig, OnSubmit } from "@tutim/types";
import { TutimWizard, TutimProvider } from "@tutim/headless";
import { defaultFields } from "@tutim/fields";
import { usePromptVersionEditorContext } from "../../lib/providers/PromptVersionEditorContext";
import { trackEvent } from "../../lib/utils/analytics";
import "./form.css";

interface Props {
  onClose: () => void;
}

const config: FormConfig = {
  layout: {
    arrayConfigs: {
      functions: {
        groupConfigs: {
          groups: [
            {
              key: "meta",
              fields: ["name", "description"],
              layout: { fieldsPerRow: 2 },
            },
          ],
        },
      },
      "functions.$.parameters": {
        groupConfigs: {
          groups: [
            {
              key: "name",
              fields: ["key", "type"],
              layout: { fieldsPerRow: 2 },
            },
          ],
        },
      },
    },
  },
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
    <TutimProvider
      key={JSON.stringify(data)}
      fieldComponents={{ ...defaultFields }}
    >
      <TutimWizard onSubmit={onSubmit} config={config} initialValues={data} />
    </TutimProvider>
  );
};

export const FunctionsEditor = ({ onClose }: Props) => {
  const { form } = usePromptVersionEditorContext();
  const settings = Form.useWatch("settings", { form, preserve: true });
  const functions = form.getFieldValue(["settings", "functions"]) || [];

  const data = functions.map(parseFromSchemaToFormData);
  const onSubmit: OnSubmit = ({ data }) => {
    const parsedFunctions = data.functions.map(parseFromFormDataToSchema);
    form.setFieldsValue({
      settings: {
        functions: parsedFunctions.length ? parsedFunctions : undefined,
      },
    });
    onClose();
    trackEvent("prompt_functions_edited");
  };

  return (
    <Row style={{ padding: "8px" }}>
      <Col span={24}>
        <FunctionsForm data={{ functions: data }} onSubmit={onSubmit} />
      </Col>
    </Row>
  );
};

interface FunctionForm {
  name: string;
  description: string;
  parameters: {
    key: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

interface FunctionSchema {
  name: string;
  description: string;
  parameters: {
    properties: Record<
      string,
      {
        type: string;
        description: string;
        required: boolean;
      }
    >;
  };
}

const mapArrWithKeyToObjByKey = <T extends { key: string }>(arr: T[]) => {
  return arr.reduce((acc, { key, ...rest }) => {
    acc[key] = rest;
    return acc;
  }, {});
};

const parseFromFormDataToSchema = (data: FunctionForm): FunctionSchema => {
  const propertiesObject = mapArrWithKeyToObjByKey(data.parameters);
  const parameters = {
    type: "object",
    properties: propertiesObject,
  };
  return { ...data, parameters };
};

const parseFromSchemaToFormData = (data: FunctionSchema): FunctionForm => {
  const parametersArray = Object.entries(data.parameters.properties).map(
    ([key, value]) => ({ key, ...value })
  );
  return { ...data, parameters: parametersArray };
};
