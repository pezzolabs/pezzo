import { Button } from "antd";
import { DeletePromptConfirmationModal } from "../DeletePromptConfirmationModal";
import { useState } from "react";

export const PromptSettingsView = () => {
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);

  return (
    <>
      <DeletePromptConfirmationModal
        open={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
      />

      <Button
        danger
        type="primary"
        onClick={() => setIsDeleteConfirmationModalOpen(true)}
      >
        Delete Prompt
      </Button>
    </>
  );
};
