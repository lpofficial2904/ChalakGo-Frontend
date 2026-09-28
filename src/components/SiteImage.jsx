import { imageSources } from "../utils/imageSources.js";

export default function SiteImage({ src, sizes, priority = false, onError, ...props }) {
  return <img {...props} {...imageSources(src, sizes)} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" onError={event => {
    // Remove responsive candidates before the caller selects a fallback.
    event.currentTarget.removeAttribute("srcset");
    if (event.currentTarget.dataset.originalFallback !== src) {
      event.currentTarget.dataset.originalFallback = src;
      if (src && event.currentTarget.getAttribute("src") !== src) {
        event.currentTarget.src = src;
        return;
      }
    }
    onError?.(event);
  }} />;
}
