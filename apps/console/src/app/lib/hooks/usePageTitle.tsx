import { useDocumentTitle } from "usehooks-ts";

/**
 * Custom hook to set the page title in the format: "{feature} - Pezzo"
 * @param feature - The name of the feature or page.
 */
export const usePageTitle = (feature: string) => {
  const title = `${feature} - Pezzo`;
  useDocumentTitle(title);
};
