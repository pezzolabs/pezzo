import { Alert, Modal, Typography } from "antd";
import { GetProjectsQuery } from "../../../@generated/graphql/graphql";
import { useDeleteProjectMutation } from "../../graphql/hooks/mutations";
import { trackEvent } from "../../lib/utils/analytics";

interface Props {
  projectToDelete: GetProjectsQuery["projects"][0] | null;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteProjectModal = ({
  projectToDelete,
  onClose,
  onDelete,
}: Props) => {
  const { mutate: deleteProject, error } = useDeleteProjectMutation();

  const handleDelete = () => {
    deleteProject(
      { id: projectToDelete.id },
      {
        onSuccess: () => {
          onDelete();
        },
      }
    );

    trackEvent("project_delete_confirmed", {
      name: projectToDelete?.name,
    });
  };

  const onCancel = () => {
    onClose();
    trackEvent("project_delete_cancelled", {
      name: projectToDelete?.name,
    });
  };

  return (
    <Modal
      title="Are you sure?"
      open={projectToDelete !== null}
      onCancel={onCancel}
      okType="danger"
      okText="Delete"
      onOk={handleDelete}
    >
      {error && (
        <Alert type="error" message={error.response.errors[0].message} />
      )}
      <p>
        Are you sure you want to delete the{" "}
        <Typography.Text style={{ fontWeight: 800 }}>
          {projectToDelete?.name}
        </Typography.Text>{" "}
        project? All associated data will be lost.
      </p>
    </Modal>
  );
};
