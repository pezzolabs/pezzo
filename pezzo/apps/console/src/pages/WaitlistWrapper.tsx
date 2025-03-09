import { useGetCurrentUser } from "../graphql/hooks/queries";
import { useWaitlist } from "../lib/hooks/useWaitlist";

export const WaitlistWrapper = ({ children }) => {
  const { shouldRenderWaitlistNotice } = useWaitlist();
  const { data: currentUserData } = useGetCurrentUser();

  if (shouldRenderWaitlistNotice) {
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
