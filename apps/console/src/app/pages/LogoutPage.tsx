import { Typography } from "antd";
import { useEffect } from "react";
import { signOut } from "supertokens-auth-react/recipe/session";

export const LogoutPage = () => {
  useEffect(() => {
    const _signOut = async () => {
      await signOut();
      window.location.href = "/login";
    };
    _signOut();
  }, []);

  return <Typography.Text>Signing out...</Typography.Text>;
};
