import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { PromptNavigation } from "./PromptNavigation";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

export const PromptPage = () => {
  return (
    <>
      <PromptNavigation />

      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </>
  );
};
