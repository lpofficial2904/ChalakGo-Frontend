export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "" : "https://chalakgo.onrender.com")
).replace(/\/$/, "");
