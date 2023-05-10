function get(name: string): string | undefined {
  return window[name] || process.env[name];
}

export const BASE_API_URL = get("NX_BASE_API_URL");
