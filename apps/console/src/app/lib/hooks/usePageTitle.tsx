import { useDocumentTitle } from "usehooks-ts";

/**
 * Custom hook to set the page title in the format: "{feature} - Pezzo"
 * @param feature - The name of the feature or page.
 */
export const usePageTitle = (feature: string = null) => {
  const title = feature ? `${feature} - Pezzo` : "Pezzo";
  useDocumentTitle(title);
};
