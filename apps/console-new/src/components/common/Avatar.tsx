import { Avatar as AntdAvatar, AvatarProps } from "antd";
import { ExtendedUser } from "~/@generated/graphql/graphql";
import { useMemo } from "react";

interface Props {
  user: Partial<ExtendedUser>;
  size: AvatarProps["size"];
  style?: AvatarProps["style"];
}

const buildInitials = (name: string) => {
  const splittedName = name.split(" ");
  if (splittedName.length === 1) return splittedName[0][0];
  const [firstName, lastName] = splittedName;
  return `${firstName[0]}${lastName[0]}`;
};

export const Avatar = ({ user, size, style }: Props) => {
  const photoUrl = useMemo(() => user.photoUrl || undefined, [user.photoUrl]);

  return (
    <AntdAvatar size={size} src={photoUrl} style={style}>
      {buildInitials(user.name || "")}
    </AntdAvatar>
  );
};
