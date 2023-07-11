import { useMutation } from "@tanstack/react-query";
import { Modal, Alert, Typography } from "antd";
import { gqlClient, queryClient } from "../../lib/graphql";
// import { DELETE_ENVIRONMENT } from "../../graphql/definitions/mutations/environments";
// import { DeleteEnvironmentMutation } from "../../../@generated/graphql/graphql";
import { GraphQLErrorResponse } from "../../graphql/types";

interface Environment {
  __typename?: "Environment";
  id: string;
  name: string;
}

interface Props {
  environmentToDelete: Environment | null;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteEnvironmentModal = ({
  environmentToDelete,
  onClose,
  onDelete,
}: Props) => {
  // const { mutate, error } = useMutation<
  //   DeleteEnvironmentMutation,
  //   GraphQLErrorResponse,
  //   string
  // >({
  //   mutationFn: (id: string) =>
  //     gqlClient.request(DELETE_ENVIRONMENT, {
  //       id,
  //     }),
  //   onSuccess: () => {
  //     onDelete();
  //     queryClient.invalidateQueries({ queryKey: ["environments"] });
  //   },
  // });

  const handleDelete = () => {
    // if (environmentToDelete) {
    //   mutate(environmentToDelete.id);
    // }
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
