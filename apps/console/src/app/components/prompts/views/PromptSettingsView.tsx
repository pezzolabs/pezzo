import { Button } from "antd";
import { DeletePromptConfirmationModal } from "../DeletePromptConfirmationModal";
import { useState } from "react";
import React from "react";
import { trackEvent } from "../../../lib/utils/analytics";

export const PromptSettingsView = () => {
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);

  React.useEffect(() => {
    trackEvent("prompt_settings_viewed");
  }, []);

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
