import { OrgRole } from "~/@generated/graphql/graphql";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../../../../../libs/ui/src";

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
}: Props) => {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Field" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={OrgRole.Member}>Member</SelectItem>
        <SelectItem value={OrgRole.Admin}>Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};
