import { ExtendedUser } from "~/@generated/graphql/graphql";
import { useMemo } from "react";
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage }from "@pezzo/ui";

interface Props {
  user: Partial<ExtendedUser>;
  className?: string;
}

const buildInitials = (name: string) => {
  const splitName = name.split(" ");
  if (splitName.length === 1) return splitName[0][0];
  const [firstName, lastName] = splitName;
  return `${firstName[0]}${lastName[0]}`;
};

export const Avatar = ({ user, className = "" }: Props) => {
  const photoUrl = useMemo(() => user.photoUrl || undefined, [user.photoUrl]);

  return (
    <ShadcnAvatar>
      <AvatarImage src={photoUrl} />
      <AvatarFallback>{buildInitials(user.name || "")}</AvatarFallback>
    </ShadcnAvatar>
  );
};
