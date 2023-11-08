import { useEffect } from "react";
import { FullScreenLoader } from "~/components/common/FullScreenLoader";
import { signOut } from "~/lib/utils/sign-out";

export const LogoutPage = () => {
  useEffect(() => {
    const _signOut = async () => {
      await signOut();
      window.location.href = "/login";
    };
    _signOut();
  }, []);

  return <FullScreenLoader />;
};
