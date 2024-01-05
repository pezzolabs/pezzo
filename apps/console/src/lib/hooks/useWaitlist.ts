import { useMemo } from "react";
import { useCurrentOrganization } from "./useCurrentOrganization";

export const useWaitlist = () => {
  const { isSuccess, currentOrgId, waitlisted } = useCurrentOrganization();

  const shouldRenderWaitlistNotice = useMemo(() => {
    return isSuccess && currentOrgId && waitlisted;
  }, [isSuccess, currentOrgId, waitlisted]);

  return {
    shouldRenderWaitlistNotice,
  };
};
