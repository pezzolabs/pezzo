import { GetOrgQuery, OrgRole } from "~/@generated/graphql/graphql";
import { Avatar } from "../common/Avatar";
import { OrgRoleSelector } from "./OrgRoleSelector";
import { useState } from "react";
import {
  useDeleteOrgMemberMutation,
  useUpdateOrgMemberRoleMutation,
} from "~/graphql/hooks/mutations";
import { useAuthContext } from "~/lib/providers/AuthProvider";
import { useCurrentOrgMembership } from "~/lib/hooks/useCurrentOrgMembership";
import { Button, Card } from "@pezzo/ui";
import { TrashIcon } from "lucide-react";
import { GenericDestructiveConfirmationModal } from "../common/GenericDestructiveConfirmationModal";

type Member = GetOrgQuery["organization"]["members"][0];

interface Props {
  members: Member[];
}

export const OrgMembersList = ({ members }: Props) => {
  const { isOrgAdmin } = useCurrentOrgMembership();
  const { currentUser } = useAuthContext();
  const { mutate: deleteOrgMember, error: deleteOrgMemberError } =
    useDeleteOrgMemberMutation();
  const { mutate: updateOrgMemberRole } = useUpdateOrgMemberRoleMutation();
  const [deletingMember, setDeletingMember] = useState<Member>(null);

  const handleDeleteMember = async (member: Member) => {
    deleteOrgMember(
      { id: member.id },
      {
        onSuccess: () => {
          setDeletingMember(null);
        },
      }
    );
  };

  const handleRoleChange = async (member: Member, role: OrgRole) => {
    updateOrgMemberRole({ id: member.id, role: role });
  };

  return (
    <>
      <GenericDestructiveConfirmationModal
        open={!!deletingMember}
        error={deleteOrgMemberError}
        title="Delete member"
        description={`Are you sure you want to remove ${deletingMember?.user.name} from your organization?`}
        confirmText="Delete"
        onConfirm={() => handleDeleteMember(deletingMember)}
        onCancel={() => setDeletingMember(null)}
      />

      {members.map((member) => (
        <Card
          key={member.id}
          className="mb-2 flex items-center gap-4 p-3 last:mb-0"
        >
          <Avatar user={member.user} className="h-8 w-8" />
          <div>
            <div className="text-sm font-semibold">
              {member.user.name} {member.user.id === currentUser.id && " (You)"}
            </div>
            <div className="text-xs opacity-60">{member.user.email}</div>
          </div>
          <div className="flex flex-1 justify-end">
            <OrgRoleSelector
              disabled={!isOrgAdmin || member.user.id === currentUser.id}
              value={member.role}
              onChange={(newRole) => handleRoleChange(member, newRole)}
              showArrow={isOrgAdmin}
            />
          </div>
          <Button
            onClick={() => setDeletingMember(member)}
            size="icon"
            variant="destructiveOutline"
            disabled={member.user.id === currentUser.id}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </>
  );
};
