import { useEffect } from "react";
import { FullScreenLoader } from "~/components/common/FullScreenLoader";
import { signOut } from "~/lib/utils/sign-out";

export const LogoutPage = () => {
  useEffect(() => {
    signOut();
    // window.location.reload();
    // const _signOut = async () => {
    //   await signOut();
    //
    // };
    // _signOut();
  }, []);

  return <FullScreenLoader />;
};
