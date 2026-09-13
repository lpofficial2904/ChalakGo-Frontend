import { API_BASE } from "./api.js";

export function assetUrl(value) {
  if (!value || typeof value !== "string") return undefined;
  value = value.trim();
  // Plain placeholder text must not become a request relative to the page URL.
  if (!value || (!/^(https?:\/\/|\/|blob:|data:image\/)/i.test(value) &&
      !/\.(png|jpe?g|webp|gif|svg|avif|ico)([?#].*)?$/i.test(value))) return undefined;
  if (value.startsWith("/uploads/")) return `${API_BASE}${value}`;
  if (import.meta.env.DEV) {
    try {
      const url = new URL(value);
      if (
        ["api.chalakgo.com", "chalakgo.onrender.com", "localhost", "127.0.0.1"].includes(
          url.hostname,
        ) &&
        url.pathname.startsWith("/uploads/")
      )
        return `${API_BASE}${url.pathname}${url.search}`;
    } catch {
      /* Bundled and relative assets need no conversion. */
    }
  }
  return value;
}
