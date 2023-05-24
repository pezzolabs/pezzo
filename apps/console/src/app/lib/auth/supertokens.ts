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

console.log(toRgba(colors.indigo[400]), colors.indigo[400]);
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
          signUpForm: {
            formFields: [
              {
                id: "name",
                label: "Name",
                placeholder: "Your name",
              },
            ],
          },
        },
        style: `

                [data-supertokens~=container] {
                    --palette-background: 51, 51, 51;
                    --palette-inputBackground: ${toRgba(colors.neutral[900])};
                    --palette-inputBorder: 41, 41, 41;
                    --palette-textTitle: 255, 255, 255;
                    --palette-textLabel: 255, 255, 255;
                    --palette-textPrimary: 255, 255, 255;
                    --palette-primary: ${toRgba(colors.indigo[400])};
                    --palette-error: 173, 46, 46;
                    --palette-textInput: 169, 169, 169;
                    --palette-textLink: 169, 169, 169;
                    width: 100%;
                    height: 100vh;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    border-radius: 0;
                }
                [data-supertokens~=divider] {
                  border-bottom: 0.3px solid ${colors.neutral[600]};
                }
                [data-supertokens~=row] {
                    box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.1);
                    border: 1px solid ${colors.neutral[600]};
                    background-color: ${colors.neutral[700]};
                    padding: 32px;
                    max-width: 480px;
                    border-radius: 8px;
                }
                [data-supertokens~=input]:focus {
                  outline: none;
                  border: none;
                }
                 [data-supertokens=button] {
                    background-color: ${colors.indigo[400]};
                    border: 0px;
                    width: 100%;
                    margin: 0 auto;
                }
                [data-supertokens=superTokensBranding] {
                    display: none;
                }
            `,
      }),
      Session.init(),
    ],
  });
};
