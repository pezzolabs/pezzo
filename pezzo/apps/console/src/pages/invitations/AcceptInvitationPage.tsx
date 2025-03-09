import { useNavigate, useParams } from "react-router-dom";
import { useAcceptOrgInvitationMutation } from "src/graphql/hooks/mutations";
import { useEffect, useState } from "react";
import { GraphQLErrorResponse } from "src/graphql/types";
import { usePageTitle } from "src/lib/hooks/usePageTitle";
import { CheckIcon, XCircleIcon } from "lucide-react";

export const AcceptInvitationPage = () => {
  usePageTitle("Accept Invitation");
  const params = useParams();
  const { mutateAsync } = useAcceptOrgInvitationMutation();
  const [orgName, setOrgName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.token) {
      setError("Invalid token");
    }

    const acceptInvitation = async (token: string) => {
      mutateAsync({ id: token })
        .then((result) => {
          setOrgName(result.acceptOrgInvitation.name);
          setTimeout(() => {
            navigate(`/orgs/${result.acceptOrgInvitation.id}`);
          }, 3000);
        })
        .catch((error: GraphQLErrorResponse) => {
          if (error.response) {
            setError(error.response.errors[0].message);
          }
        });
    };

    acceptInvitation(params.token as string);
  }, [params, setError, mutateAsync, navigate]);

  return (
    <div className="mt-20 flex flex-col items-center gap-4">
      {error && (
        <>
          <XCircleIcon className="h-28 w-28 text-destructive" />
          <h1>Could not accept invitation</h1>
          <p className="text-muted-foreground">{error}</p>
        </>
      )}

      {orgName && (
        <>
          <CheckIcon className="h-28 w-28 text-green-500" />
          <h1>You're in!</h1>
          <p className="text-muted-foreground">
            You have successfully joined ${orgName}! Redirecting...
          </p>
        </>
      )}
    </div>
  );
};
