// Development uses Vite's local API proxy; production uses the deployed API.
export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "" : "https://api.chalakgo.com")
).replace(/\/$/, "");
