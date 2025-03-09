import { useEffect } from "react";
import { FullScreenLoader } from "src/components/common/FullScreenLoader";
import { signOut } from "src/lib/utils/sign-out";

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
