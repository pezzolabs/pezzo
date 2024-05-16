// import SuperTokens from "supertokens-auth-react";
// import ThirdPartyEmailPassword, {
//   Google,
// } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
// import Session from "supertokens-auth-react/recipe/session";
// import {
//   AUTH_GOOGLE_ENABLED,
//   SUPERTOKENS_API_DOMAIN,
//   SUPERTOKENS_WEBSITE_DOMAIN,
// } from "~/env";
//
// export const googleEnabled = AUTH_GOOGLE_ENABLED === "true";
//
// export const initSuperTokens = () => {
//   const providers = [];
//
//   if (googleEnabled) {
//     providers.push(Google.init());
//   }
//
//   SuperTokens.init({
//     appInfo: {
//       appName: "Pezzo",
//       apiDomain: SUPERTOKENS_API_DOMAIN,
//       websiteDomain: SUPERTOKENS_WEBSITE_DOMAIN,
//       apiBasePath: "/api/auth",
//       websiteBasePath: "/login",
//     },
//     recipeList: [
//       ThirdPartyEmailPassword.init({
//         signInAndUpFeature: {
//           providers,
//         },
//       }),
//       Session.init(),
//     ],
//   });
// };
