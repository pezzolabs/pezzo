import { Select } from "antd";
import { OrgRole } from "~/@generated/graphql/graphql";
import { useState } from "react";

interface Props {
  value?: OrgRole;
  onChange: (role: OrgRole) => void;
  disabled?: boolean;
  showArrow?: boolean;
}

export const OrgRoleSelector = ({
  value = OrgRole.Member,
  onChange,
  disabled,
  showArrow = true,
}: Props) => {
  const [role, setRole] = useState(value);

  const handleRoleChange = (role: OrgRole) => {
    setRole(role);
    onChange(role);
  };

  return (
    <Select
      disabled={disabled}
      style={{ width: 120 }}
      value={role}
      onChange={handleRoleChange}
      showArrow={showArrow}
    >
      <Select.Option value={OrgRole.Member}>Member</Select.Option>
      <Select.Option value={OrgRole.Admin}>Admin</Select.Option>
    </Select>
  );
};
