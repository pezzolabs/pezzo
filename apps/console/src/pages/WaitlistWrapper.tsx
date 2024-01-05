import { useMemo } from "react";
import { useGetCurrentUser } from "~/graphql/hooks/queries";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";

export const WaitlistWrapper = ({ children }) => {
  const { isSuccess, currentOrgId, waitlisted } = useCurrentOrganization();
  const { data: currentUserData } = useGetCurrentUser();

  const shouldRenderWaitlistNotice = useMemo(() => {
    return isSuccess && currentOrgId && waitlisted;
  }, [isSuccess, currentOrgId, waitlisted]);

  if (shouldRenderWaitlistNotice) {
    console.log(currentUserData.me.email);

    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="mb-4 font-heading font-medium">
          You're on the waitlist!
        </h1>
        <div className="space-y-4 text-neutral-400">
          <p>Thank you for signing up for Pezzo Cloud.</p>
          <p>
            You will receive an invitation at{" "}
            <span className="font-semibold">{currentUserData.me.email}</span>{" "}
            soon.
          </p>
          <p>
            Need access sooner? Email us at{" "}
            <a
              className="font-semibold text-primary underline"
              href="mailto:hello@pezzo.ai"
            >
              hello@pezzo.ai
            </a>
          </p>
        </div>
      </div>
    );
  } else {
    return children;
  }
};
