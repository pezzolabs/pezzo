import { signOut as supertokensSignOut } from "supertokens-auth-react/recipe/session";
import { trackEvent } from "./analytics";

export async function signOut() {
  trackEvent("user_logout");
  localStorage.clear();  // Clear all local storage when login out to avoid use old user id when login again
  await supertokensSignOut();
  window.location.href = "/login";
}
