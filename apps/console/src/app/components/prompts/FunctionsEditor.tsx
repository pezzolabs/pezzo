import { Col, Row } from "antd";
import { FormConfig, OnSubmit } from "@tutim/types";
import { TutimWizard, TutimProvider } from "@tutim/headless";
import { defaultFields } from "@tutim/fields";
import { usePromptVersionEditorContext } from "../../lib/providers/PromptVersionEditorContext";
import { ProviderSettingsKeys } from "@pezzo/types";

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
              fields: ["key", "type", "required"],
              layout: { fieldsPerRow: 3 },
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
                {
                  key: "required",
                  label: "Is Required?",
                  type: "checkbox",
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

export const FunctionsEditor = ({ onClose }: Props) => {
  const { form } = usePromptVersionEditorContext();
  const functions =
    form.getFieldValue([
      "settings",
      ProviderSettingsKeys.OPENAI_CHAT_COMPLETION,
      "functions",
    ]) || [];

  const data = functions.map(parseFromSchemaToFormData);
  const onSubmit: OnSubmit = ({ data }) => {
    const parsedFunctions = data.functions.map(parseFromFormDataToSchema);
    form.setFieldsValue({
      settings: {
        [ProviderSettingsKeys.OPENAI_CHAT_COMPLETION]: {
          functions: parsedFunctions,
        },
      },
    });
    onClose();
  };
  return (
    <Row style={{ padding: "8px" }}>
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
