import { Alert, Button, Form, Input, Modal, Select } from "antd";
import { useCreateCreateFineTunedModelVariantMutation } from "../../graphql/hooks/mutations";
import { css } from "@emotion/css";
import { useParams } from "react-router-dom";
import { useDatasets } from "../../graphql/hooks/queries";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

type Inputs = {
  slug: string;
  datasetId: string;
};

export const CreateVariantDialog = ({ open, onClose, onCreated }: Props) => {
  const [form] = Form.useForm<Inputs>();
  const { modelId } = useParams();
  const { datasets } = useDatasets();

  const { mutate: createVariant, error, isLoading } =
    useCreateCreateFineTunedModelVariantMutation({
      onSuccess: () => {
        onCreated();
      },
    });

  const handleFormFinish = async (values: Inputs) => {
    createVariant({
      slug: values.slug,
      datasetId: values.datasetId,
      modelId,
    });
    form.resetFields();
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="New Fine Tuned Model Variant"
      open={open}
      onCancel={onCancel}
      footer={false}
    >
      {error && (
        <Alert type="error" message={error.response.errors[0].message} />
      )}
      {isLoading && <Alert type="info" message="Creating variant..." />}
      <Form
        form={form}
        layout="vertical"
        name="basic"
        style={{ maxWidth: 600, marginTop: 20 }}
        onFinish={handleFormFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Dataset"
          name="datasetId"
          fieldId="datasetId"
          rules={[{ required: true, message: "Dataset is required" }]}
        >
          <Select
            options={datasets?.map((dataset) => ({
              label: dataset.name,
              value: dataset.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Variant slug"
          name="slug"
          fieldId="slug"
          rules={[{ required: true, message: "Dataset name is required" }]}
        >
          <Input placeholder="e.g. kind-assistant-july-2022" />
        </Form.Item>

        <Form.Item
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
