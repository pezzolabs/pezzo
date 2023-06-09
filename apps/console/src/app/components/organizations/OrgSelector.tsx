import { Button, Popover, Typography } from "antd";
import styled from "@emotion/styled";
import { useOrganizations } from "../../lib/hooks/useOrganizations";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const StyledOrgButton = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
`;

export const OrgSelector = () => {
  const { organizations } = useOrganizations();
  const { organization: currentOrg, selectOrg } = useCurrentOrganization();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectOrg = (orgId: string) => {
    setIsPopoverOpen(false);
    selectOrg(orgId);
    navigate(`/orgs/${orgId}`, { replace: true });
  };

  return (
    currentOrg &&
    organizations && (
      <Popover
        trigger={["click"]}
        title="Select organization"
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        content={
          organizations &&
          organizations.map((org) => (
            <StyledOrgButton
              onClick={() => handleSelectOrg(org.id)}
              key={org.id}
            >
              <Typography.Text>{org.name}</Typography.Text>
            </StyledOrgButton>
          ))
        }
      >
        <Button type="link" style={{ color: "white" }}>
          {currentOrg.name}
        </Button>
      </Popover>
    )
  );
};
