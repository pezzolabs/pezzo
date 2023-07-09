import styled from "@emotion/styled";
import { Button, Form, Input, Select, Tag, Tooltip, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { FilterInput } from "../../../../@generated/graphql/graphql";
import {
  FILTER_FIELDS_LIST,
  NUMBER_FILTER_OPERATORS,
  STRING_FILTER_OPERATORS,
} from "../../../lib/constants/filters";

const { Text } = Typography;

const FilterItemTag = styled(Tag)<{ formMode?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: ${({ formMode }) => (formMode ? "0px" : "4px 8px")};
  border: ${({ formMode }) => (formMode ? "none" : "1px solid #5FDD97")};
  background: ${({ formMode }) =>
    formMode ? "none" : "rgba(255, 255, 255, 0.04)"};
`;

interface Props {
  onRemoveFilter: () => void;
  field: string;
  operator: string;
  value: string;
}

export const FilterItem = ({
  field,
  operator,
  value,
  onRemoveFilter,
}: Props) => {
  const translatedField = useMemo(() => {
    if (field.includes(".")) {
      const fieldParts = field.split(".");

      return fieldParts.reduce((acc, part) => `${acc} ${part}`, "");
    }

    return field;
  }, [field]);

  return (
    <FilterItemTag closable onClose={onRemoveFilter}>
      <Text>{translatedField}</Text>
      <Text style={{ fontWeight: "bold" }}>{operator}</Text>
      <Text>{value}</Text>
    </FilterItemTag>
  );
};

const StyledForm = styled(Form)`
  .ant-form-item-explain-error {
    position: absolute;
  }
`;

export const AddFilterForm = ({
  onAdd,
  onCancel,
}: {
  onAdd: (input: FilterInput) => void;
  onCancel: () => void;
}) => {
  const [form] = Form.useForm<FilterInput>();
  const [_, setTrigger] = useState(0);

  const handleFormSubmit = () => {
    onAdd(form.getFieldsValue());
    form.resetFields();
  };

  return (
    <StyledForm
      form={form}
      layout="vertical"
      name="basic"
      style={{ display: "flex", gap: 8 }}
      onFinish={handleFormSubmit}
      autoComplete="off"
    >
      <Form.Item
        name="field"
        style={{ margin: 0, width: 120 }}
        rules={[
          {
            required: true,
            type: "string",
            validateTrigger: "onSubmit",
            message: "Must be a valid field name",
          },
        ]}
      >
        <Select placeholder="Select a field" options={FILTER_FIELDS_LIST} />
      </Form.Item>

      <Form.Item
        fieldId="operator"
        dependencies={["field"]}
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            type: "string",
            validateTrigger: "onSubmit",
            message: "Must be a valid operator",
          },
        ]}
      >
        {({ getFieldValue }) => {
          const selectedFilterField = FILTER_FIELDS_LIST.find(
            (field) => field.value === getFieldValue("field")
          );

          const options =
            selectedFilterField?.type === "string"
              ? STRING_FILTER_OPERATORS
              : NUMBER_FILTER_OPERATORS;

          return (
            <Form.Item noStyle name="operator">
              <Select
                placeholder="Select an operator"
                style={{ width: 120 }}
                options={options}
              />
            </Form.Item>
          );
        }}
      </Form.Item>

      <Form.Item
        name="value"
        fieldId="value"
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            type: "string",
            validateTrigger: "onSubmit",
            message: "Must be a valid value",
          },
        ]}
      >
        <Input placeholder="Value" />
      </Form.Item>

      <Form.Item style={{ margin: 0 }} shouldUpdate>
        {({ getFieldsValue }) => {
          const { field, operator, value } = getFieldsValue();
          const fieldsHasError = form
            .getFieldsError()
            .some((field) => field.errors.length > 0);
          const formIsComplete = field && operator && value && !fieldsHasError;
          return (
            <Tooltip title="submit">
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />}
                disabled={!formIsComplete}
              />
            </Tooltip>
          );
        }}
      </Form.Item>
      <Form.Item style={{ margin: 0 }}>
        <Tooltip title="cancel">
          <Button
            danger
            type="primary"
            htmlType="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            icon={<CloseOutlined />}
          />
        </Tooltip>
      </Form.Item>
    </StyledForm>
  );
};

export const AddFilterItem = ({
  onAdd,
}: {
  onAdd: (input: FilterInput) => void;
}) => {
  const [addFormOpen, setAddFormOpen] = useState(false);

  const handleAdd = useCallback(
    (filter: FilterInput) => {
      onAdd(filter);
      setAddFormOpen(false);
    },
    [onAdd]
  );

  if (addFormOpen) {
    return (
      <AddFilterForm onAdd={handleAdd} onCancel={() => setAddFormOpen(false)} />
    );
  }
  return (
    <Button onClick={() => setAddFormOpen(true)} type="dashed">
      + Add Filter
    </Button>
  );
};
