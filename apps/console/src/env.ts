export function getEnvVariable(name: string): string | undefined {
  return window[name] || process.env[name];
}

export const BASE_API_URL = getEnvVariable("NX_BASE_API_URL");
export const AUTH_GITHUB_ENABLED = getEnvVariable("NX_AUTH_GITHUB_ENABLED");
export const AUTH_GOOGLE_ENABLED = getEnvVariable("NX_AUTH_GOOGLE_ENABLED");
export const INTERCOM_APP_ID = getEnvVariable("NX_INTERCOM_APP_ID");
export const HOTJAR_SITE_ID = getEnvVariable("NX_HOTJAR_SITE_ID");
export const HOTJAR_VERSION = getEnvVariable("NX_HOTJAR_VERSION");
export const SUPERTOKENS_API_DOMAIN = getEnvVariable(
  "NX_SUPERTOKENS_API_DOMAIN"
);
export const SUPERTOKENS_WEBSITE_DOMAIN = getEnvVariable(
  "NX_SUPERTOKENS_WEBSITE_DOMAIN"
);
export const SENTRY_DSN_URL = getEnvVariable("NX_SENTRY_DSN_URL");
export const SEGMENT_WRITE_KEY = getEnvVariable("NX_SEGMENT_WRITE_KEY");
export const GTM_TAG_ID = getEnvVariable("NX_GTM_TAG_ID");
export const DEBUG_MODE = getEnvVariable("NX_DEBUG_MODE");