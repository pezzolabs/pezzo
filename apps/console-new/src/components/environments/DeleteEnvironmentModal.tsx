import { Alert, Modal, Typography } from "antd";
import { EnvironmentsQuery } from "../../../@generated/graphql/graphql";
import { useDeleteEnvironmentMutation } from "../../graphql/hooks/mutations";
import { trackEvent } from "../../lib/utils/analytics";

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
  const { mutate: deleteEnvironment, error } = useDeleteEnvironmentMutation();

  const handleDelete = () => {
    if (environmentToDelete) {
      deleteEnvironment({ id: environmentToDelete.id });
    }

    onDelete();
    trackEvent("environment_delete_confirmed", {
      name: environmentToDelete?.name,
    });
  };

  const onCancel = () => {
    onClose();
    trackEvent("environment_delete_cancelled", {
      name: environmentToDelete?.name,
    });
  };

  return (
    <Modal
      title="Are you sure?"
      open={environmentToDelete !== null}
      onCancel={onCancel}
      okType="danger"
      okText="Delete"
      onOk={handleDelete}
    >
      {error && (
        <Alert type="error" message={error.response.errors[0].message} />
      )}
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
