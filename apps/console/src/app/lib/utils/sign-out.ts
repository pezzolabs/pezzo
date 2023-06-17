import { signOut as supertokensSignOut } from "supertokens-auth-react/recipe/session";

export async function signOut() {
  await supertokensSignOut();
  localStorage.removeItem("currentOrgId");
  window.location.href = "/login";
}
