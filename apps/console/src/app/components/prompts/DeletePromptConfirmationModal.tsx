import { Button, Modal, Typography } from "antd";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { useMutation } from "@tanstack/react-query";
import { DeletePromptMutation } from "../../../@generated/graphql/graphql";
import { GraphQLErrorResponse } from "../../graphql/types";
import { gqlClient, queryClient } from "../../lib/graphql";
import { DELETE_PROMPT } from "../../graphql/mutations/prompts";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const DeletePromptConfirmationModal = ({ open, onClose }: Props) => {
  const { project } = useCurrentProject();
  const { prompt } = useCurrentPrompt();
  const navigate = useNavigate();

  const { mutate, error } = useMutation<
    DeletePromptMutation,
    GraphQLErrorResponse,
    string
  >({
    mutationFn: (id: string) =>
      gqlClient.request(DELETE_PROMPT, {
        data: {
          id,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      navigate(`/projects/${project.id}/prompts`);
    },
  });

  const handleDelete = () => {
    mutate(prompt.id);
  };

  return (
    <Modal
      title="Delete prompt"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button danger type="primary" key="confirm" onClick={handleDelete}>
          Delete
        </Button>,
      ]}
    >
      <Typography.Paragraph>
        Are you sure you want to delete this prompt?
      </Typography.Paragraph>
    </Modal>
  );
};
