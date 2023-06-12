import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_ORGANIZATION } from "../../graphql/queries/organizations";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import { useOrganizations } from "./useOrganizations";

const defaultProps = {
  includeMembers: false,
  includeInvitations: false,
};

export const useCurrentOrganization = ({
  includeMembers,
  includeInvitations,
} = defaultProps) => {
  const { organizations } = useOrganizations();
  const [currentOrgId, setCurrentOrgId] = useLocalStorage("currentOrgId", null);

  useEffect(() => {
    if (organizations && !currentOrgId) {
      setCurrentOrgId(organizations[0].id);
    }
  }, [currentOrgId, organizations, setCurrentOrgId]);

  const { data, isLoading } = useQuery({
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
    isLoading,
    currentOrgId,
    selectOrg,
  };
};