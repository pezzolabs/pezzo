import { Result } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAcceptOrgInvitationMutation } from "../../graphql/hooks/mutations";
import { useEffect, useState } from "react";
import { GraphQLErrorResponse } from "../../graphql/types";

export const AcceptInvitationPage = () => {
  const params = useParams();
  const { mutateAsync } = useAcceptOrgInvitationMutation();
  const [orgName, setOrgName] = useState<string>(null);
  const [error, setError] = useState<string>(null);
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
          setError(error.response.errors[0].message);
        });
    };

    acceptInvitation(params.token);
  }, [params, setError, mutateAsync, navigate]);

  if (error) {
    return (
      <Result
        status="error"
        title="Could not accept invitation"
        subTitle={error}
      />
    );
  }

  return (
    orgName && (
      <Result
        status="success"
        title={"You're in!"}
        subTitle={`You have successfully joined ${orgName}! Redirecting...`}
      />
    )
  );
};
