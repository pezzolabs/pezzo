import { Modal, Typography } from "antd";
import { EnvironmentsQuery } from "../../../@generated/graphql/graphql";
import { useDeleteEnvironmentMutation } from "../../graphql/hooks/mutations";

interface Props {
  environmentToDelete: EnvironmentsQuery["environments"][0] | null;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteEnvironmentModal = ({
  environmentToDelete,
  onClose,
  onDelete,
}: Props) => {
  const { mutate: deleteEnvironment } = useDeleteEnvironmentMutation();

  const handleDelete = () => {
    if (environmentToDelete) {
      deleteEnvironment({ id: environmentToDelete.id });
    }

    onDelete();
  };

  return (
    <Modal
      title="Are You Sure?"
      open={environmentToDelete !== null}
      onCancel={onClose}
      okType="danger"
      okText="Delete"
      onOk={handleDelete}
    >
      {/* {error && (
        <Alert type="error" message={error.response.errors[0].message} />
      )} */}
      <p>
        Are you sure you want to remove{" "}
        <Typography.Text style={{ fontWeight: 800 }}>
          {environmentToDelete?.name}
        </Typography.Text>{" "}
        from your environments? All associated data will be lost.
      </p>
    </Modal>
  );
};
