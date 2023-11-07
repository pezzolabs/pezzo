import { Button, Card } from "@pezzo/ui";
import { GetOrgQuery, OrgRole } from "~/@generated/graphql/graphql";
import { OrgRoleSelector } from "./OrgRoleSelector";
import { useCopyToClipboard } from "usehooks-ts";
import { useState } from "react";
import {
  useDeleteOrgInvitationMutation,
  useUpdateOrgInvitationMutation,
} from "~/graphql/hooks/mutations";
import { useCurrentOrgMembership } from "~/lib/hooks/useCurrentOrgMembership";
import { CheckIcon, CopyIcon, TrashIcon } from "lucide-react";
import { GenericDestructiveConfirmationModal } from "../common/GenericDestructiveConfirmationModal";

type Invitation = GetOrgQuery["organization"]["invitations"][0];

interface Props {
  invitations: Invitation[];
}

const CopyInvitationButton = ({ invitationId }: { invitationId: string }) => {
  const [copiedValue, copy] = useCopyToClipboard();

  const url = new URL(window.location.origin);
  url.pathname = `/invitations/${invitationId}/accept`;

  return (
    <Button variant="ghost" onClick={() => copy(url.toString())}>
      {copiedValue ? (
        <>
          <CheckIcon className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon className="mr-2 h-4 w-4" />
          Copy Link
        </>
      )}
    </Button>
  );
};

export const OrgInvitationsList = ({ invitations }: Props) => {
  const { isOrgAdmin } = useCurrentOrgMembership();
  const { mutate: deleteOrgInvitation, error: updateOrgInvitationError } =
    useDeleteOrgInvitationMutation();
  const { mutate: updateOrgInvitation } = useUpdateOrgInvitationMutation();
  const [deletingInvitation, setDeletingInvitation] =
    useState<Invitation>(null);
  const [, copy] = useCopyToClipboard();

  const handleCopyInvitation = (invitation: Invitation) => {
    const url = new URL(window.location.origin);
    url.pathname = `/invitations/${invitation.id}/accept`;
    copy(url.toString());
  };

  const handleDeleteInvitation = async (invitation: Invitation) => {
    deleteOrgInvitation(
      { id: invitation.id },
      {
        onSuccess: () => {
          setDeletingInvitation(null);
        },
      }
    );
  };

  const handleRoleChange = (invitation: Invitation, role: OrgRole) => {
    updateOrgInvitation({ invitationId: invitation.id, role });
  };

  return (
    <>
      <GenericDestructiveConfirmationModal
        open={!!deletingInvitation}
        error={updateOrgInvitationError}
        title="Delete invitation"
        description={`Are you sure you delete this invitation?`}
        confirmText="Delete"
        onConfirm={() => handleDeleteInvitation(deletingInvitation)}
        onCancel={() => setDeletingInvitation(null)}
      />

      {invitations
        .sort((a, b) => a.email.localeCompare(b.email))
        .map((invitation) => (
          <Card
            key={invitation.id}
            className="mb-2 flex items-center gap-4 p-3 last:mb-0"
          >
            <div>
              <div className="text-sm opacity-60">{invitation.email}</div>
            </div>
            <div className="flex flex-1 justify-end gap-2">
              <CopyInvitationButton invitationId={invitation.id} />

              <OrgRoleSelector
                disabled={!isOrgAdmin}
                value={invitation.role}
                onChange={(newRole) => handleRoleChange(invitation, newRole)}
                showArrow={isOrgAdmin}
              />
            </div>
            <Button
              onClick={() => setDeletingInvitation(invitation)}
              size="icon"
              variant="destructiveOutline"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </Card>
        ))}
    </>
  );
};
