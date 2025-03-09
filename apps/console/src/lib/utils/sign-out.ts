import { signOut as supertokensSignOut } from "supertokens-auth-react/recipe/session";
import { trackEvent } from "./analytics";

export async function signOut() {
  trackEvent("user_logout");
  await supertokensSignOut();
  window.location.href = "/login";
}
