import styled from "@emotion/styled";
import { Button, Form, Input, Select, Tag, Tooltip, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { FILTER_FIELDS_ALLOW_LIST } from "../../../lib/constants/filters";
import {
  FilterInput,
  FilterOperator,
} from "../../../../@generated/graphql/graphql";

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

interface Props extends FilterInput {
  onRemoveFilter: () => void;
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
      <Text style={{ fontWeight: "bold" }}>: {operator} :</Text>
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
        fieldId="field"
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            type: "string",
            validateTrigger: "onSubmit",
            message: "Must be a valid field name",
          },
        ]}
      >
        <Select
          placeholder="Select a field"
          options={[...FILTER_FIELDS_ALLOW_LIST].map((f) => ({
            value: f,
            label: f,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="operator"
        fieldId="operator"
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
        <Select
          placeholder="Select an operator"
          options={Object.keys(FilterOperator).map((f) => ({
            value: FilterOperator[f],
            label: f,
          }))}
        />
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

  return (
    <FilterItemTag formMode={addFormOpen} onClick={() => setAddFormOpen(true)}>
      +
      {addFormOpen ? (
        <AddFilterForm
          onAdd={handleAdd}
          onCancel={() => setAddFormOpen(false)}
        />
      ) : (
        <Text>Add Filter</Text>
      )}
    </FilterItemTag>
  );
};
