import { useEffect } from "react";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { Loader } from "../../components/common/Loader";

export const AuthCallbackPage = () => {
  const handleAuthCallback = async () => {
    try {
      const response = await ThirdPartyEmailPassword.thirdPartySignInAndUp();
      if (response.status !== "OK") {
        return window.location.assign("/login?error=signin");
      }

      window.location.assign("/");
    } catch (_) {
      return window.location.assign("/login?error=signin");
    }
  };

  useEffect(() => {
    handleAuthCallback();
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader />
    </div>
  );
};
