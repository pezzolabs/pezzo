import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_ORGANIZATION } from "~/graphql/definitions/queries/organizations";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import { useOrganizations } from "./useOrganizations";
import { useParams } from "react-router-dom";

const defaultProps = {
  includeMembers: false,
  includeInvitations: false,
};

export const useCurrentOrganization = ({
  includeMembers,
  includeInvitations,
} = defaultProps) => {
  const { organizations } = useOrganizations();
  const { orgId } = useParams<{ orgId: string }>();
  // console.log("orgId: " + orgId)

  // TODO: currentOrgId in local storage might be different than the actual org if customer has multiple orgs for multiple users
  const [currentOrgId, setCurrentOrgId] = useLocalStorage(
    "currentOrgId",
    orgId
  );
  // console.log("currentOrgId: " + currentOrgId)

  useEffect(() => {
    if (organizations && !currentOrgId) {
      setCurrentOrgId(organizations[0].id);
    }
  }, [currentOrgId, organizations, setCurrentOrgId]);

  const { data, isLoading, isSuccess, error, isError } = useQuery({
    queryKey: [
      "currentOrganization",
      currentOrgId,
      includeMembers,
      includeInvitations,
    ],
    queryFn: async () =>
      gqlClient.request(GET_ORGANIZATION, {
        data: { id: currentOrgId },
        includeMembers,
        includeInvitations,
      }),
    enabled: !!currentOrgId,
  });

  const selectOrg = (orgId: string) => {
    setCurrentOrgId(orgId);
  };

  return {
    organization: data?.organization,
    organizationId: data?.organization?.id,
    isLoading,
    isSuccess,
    isError,
    error,
    currentOrgId,
    selectOrg,
    waitlisted: data?.organization?.waitlisted,
  };
};
