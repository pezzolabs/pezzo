import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_USER_ORG_MEMBERSHIP } from "~/graphql/definitions/queries/organizations";
import { useCurrentOrganization } from "./useCurrentOrganization";
import { useAuthContext } from "../providers/AuthProvider";
import { OrgRole } from "~/@generated/graphql/graphql";

export const useCurrentOrgMembership = () => {
  const { organization } = useCurrentOrganization();
  const { currentUser } = useAuthContext();

  const { data, isLoading } = useQuery({
    queryKey: ["userOrgMembership", organization?.id, currentUser.id],
    queryFn: async () =>
      gqlClient.request(GET_USER_ORG_MEMBERSHIP, {
        data: { organizationId: organization?.id, userId: currentUser.id },
      }),
    enabled: !!organization && !!currentUser,
  });

  return {
    membership: data?.userOrgMembership,
    role: data?.userOrgMembership.role,
    isOrgAdmin: data?.userOrgMembership.role === OrgRole.Admin,
    isLoading,
  };
};
