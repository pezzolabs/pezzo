import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { OrgMembersList } from "~/components/organizations/OrgMembersList";
import { OrgInvitationsList } from "~/components/organizations/OrgInvitationsList";
import { InviteOrgMemberModal } from "~/components/organizations/InviteOrgMemberModal";
import { useState } from "react";
import { useCurrentOrgMembership } from "~/lib/hooks/useCurrentOrgMembership";
import { trackEvent } from "~/lib/utils/analytics";
import { Button } from "@pezzo/ui";
import { Plus } from "lucide-react";

export const MembersView = () => {
  const { organization } = useCurrentOrganization({
    includeMembers: true,
    includeInvitations: true,
  });
  const { isOrgAdmin } = useCurrentOrgMembership();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (!organization) {
    return null;
  }

  const { members, invitations } = organization;

  const onOpenInviteModal = () => {
    setIsInviteModalOpen(true);
    trackEvent("organization_member_invite_modal_opened");
  };

  return (
    <>
      <InviteOrgMemberModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      <div className="max-w-[800px]">
        <div className="mb-2 flex items-center gap-4">
          <h2 className="flex-1 text-2xl font-semibold">
            Members ({members.length})
          </h2>
          <div>
            {isOrgAdmin && (
              <Button onClick={onOpenInviteModal}>
                <Plus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            )}
          </div>
        </div>

        <OrgMembersList members={members} />
        {isOrgAdmin && invitations.length > 0 && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold">
              Pending Invitations ({invitations.length})
            </h2>

            <OrgInvitationsList invitations={invitations} />
          </div>
        )}
      </div>
    </>
  );
};
