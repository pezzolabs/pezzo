import { PromptNavigation } from "./PromptNavigation";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { FullScreenLoader } from "~/components/common/FullScreenLoader";

export const PromptPage = () => {
  return (
    <>
      <PromptNavigation />

      <Suspense fallback={<FullScreenLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
};
