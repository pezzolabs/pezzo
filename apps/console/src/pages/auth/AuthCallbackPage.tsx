import { useEffect } from "react";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { Loader } from "~/components/common/Loader";
import { trackEvent } from "~/lib/utils/analytics";

export const AuthCallbackPage = () => {
  const handleAuthCallback = async () => {
    try {
      const response = await ThirdPartyEmailPassword.thirdPartySignInAndUp();

      if (response.status !== "OK") {
        return window.location.assign("/login?error=signin");
      }

      if (response.createdNewUser) {
        trackEvent("user_signup", { method: "third_party" });
      } else {
        trackEvent("user_login", { method: "third_party" });
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
    <div className="tailwind">
      <div className="dark h-[100vh] w-[100vw] font-sans">
        <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-slate-300">
          <Loader />
        </div>
      </div>
    </div>
  );
};
