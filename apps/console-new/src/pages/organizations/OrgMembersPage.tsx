import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { OrgMembersList } from "~/components/organizations/OrgMembersList";
import { OrgInvitationsList } from "~/components/organizations/OrgInvitationsList";
import { InviteOrgMemberModal } from "~/components/organizations/InviteOrgMemberModal";
import { useState } from "react";
import { useCurrentOrgMembership } from "~/lib/hooks/useCurrentOrgMembership";
import { trackEvent } from "~/lib/utils/analytics";
import { Button, Card } from "@pezzo/ui";
import { Plus } from "lucide-react";

export const OrgMembersPage = () => {
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

      <div className="mb-6 border-b bg-white">
        <div className="container flex h-24 items-center">
          <h1>Members</h1>
        </div>
      </div>

      <div className="container space-y-6">
        <Card className="mx-auto flex flex-col gap-y-6 p-10">
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2>Members</h2>
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
          </section>
        </Card>

        {isOrgAdmin && invitations.length > 0 && (
          <Card className="mx-auto flex flex-col gap-y-6 p-10">
            <section>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2>Invitations</h2>
              </div>
              <OrgInvitationsList invitations={invitations} />
            </section>
          </Card>
        )}
      </div>
    </>
  );
};
