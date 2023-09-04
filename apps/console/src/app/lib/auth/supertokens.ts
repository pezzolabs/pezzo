import SuperTokens from "supertokens-auth-react";
import ThirdPartyEmailPassword, {
  Github,
  Google,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";
import {
  AUTH_GITHUB_ENABLED,
  AUTH_GOOGLE_ENABLED,
  SUPERTOKENS_API_DOMAIN,
  SUPERTOKENS_WEBSITE_DOMAIN,
} from "../../../env";
import colors from "tailwindcss/colors";

const toRgba = (hexColor: string) => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
};

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
      apiDomain: SUPERTOKENS_API_DOMAIN,
      websiteDomain: SUPERTOKENS_WEBSITE_DOMAIN,
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
