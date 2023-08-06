import { Button, Col, Row, Typography } from "antd";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { OrgMembersList } from "../../components/organizations/OrgMembersList";
import { OrgInvitationsList } from "../../components/organizations/OrgInvitationsList";
import { PlusOutlined } from "@ant-design/icons";
import { InviteOrgMemberModal } from "../../components/organizations/InviteOrgMemberModal";
import { useState } from "react";
import { useCurrentOrgMembership } from "../../lib/hooks/useCurrentOrgMembership";
import { trackEvent } from "../../lib/utils/analytics";

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
      <div style={{ marginBottom: 20, maxWidth: 800 }}>
        <Row align="middle">
          <Col flex="1">
            <Typography.Title level={2}>
              Members ({members.length})
            </Typography.Title>
          </Col>
          {isOrgAdmin && (
            <Col>
              <Button
                onClick={onOpenInviteModal}
                type="primary"
                icon={<PlusOutlined />}
              >
                Invite Member
              </Button>
            </Col>
          )}
        </Row>
        <OrgMembersList members={members} />
      </div>
      {isOrgAdmin && invitations.length > 0 && (
        <div style={{ marginBottom: 20, maxWidth: 800 }}>
          <Typography.Title level={2}>
            Pending Invitations ({invitations.length})
          </Typography.Title>
          <OrgInvitationsList invitations={invitations} />
        </div>
      )}
    </>
  );
};
