import { useEffect } from "react";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";

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

  return <>Loading...</>;
};
