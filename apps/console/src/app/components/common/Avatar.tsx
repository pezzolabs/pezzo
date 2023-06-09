import { Avatar as AntdAvatar, AvatarProps } from "antd";
import { GetMeQuery } from "../../../@generated/graphql/graphql";

type User = GetMeQuery["me"];

interface Props {
  user: User;
  size: AvatarProps["size"];
}

const buildInitials = (name: string) => {
  const splittedName = name.split(" ");
  if (splittedName.length === 1) return splittedName[0][0];
  const [firstName, lastName] = splittedName;
  return `${firstName[0]}${lastName[0]}`;
};

export const Avatar = ({ user, size }: Props) => {
  return (
    <AntdAvatar
      size={size}
      src={user.photoUrl ? <img src={user.photoUrl} alt="avatar" /> : undefined}
    >
      {buildInitials(user.name || "")}
    </AntdAvatar>
  );
};
