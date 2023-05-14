import SuperTokens from "supertokens-auth-react";
import ThirdPartyEmailPassword, {
  Github,
  Google,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { AUTH_GITHUB_ENABLED, AUTH_GOOGLE_ENABLED } from "../../../env";

const githubEnabled = AUTH_GITHUB_ENABLED === "true";
const googleEnabled = AUTH_GOOGLE_ENABLED === "true";

export const initSuperTokens = () => {
  const providers = [];

  if (githubEnabled) {
    providers.push(Github.init());
  }

  if (googleEnabled) {
    providers.push(Google.init());
  }

  SuperTokens.init({
    appInfo: {
      appName: "Pezzo",
      apiDomain: "http://localhost:3000",
      websiteDomain: "http://localhost:4200",
      apiBasePath: "/api/auth",
      websiteBasePath: "/login",
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
        signInAndUpFeature: {
          providers,
        },
      }),
      Session.init(),
    ],
  });
};
