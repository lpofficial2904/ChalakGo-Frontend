const widths = [320, 640, 960, 1440, 1920];

export function imageSources(src, sizes = "(max-width: 640px) 100vw, 50vw") {
  if (!src || typeof src !== "string") return { src };
  let url;
  try { url = new URL(src, "https://relative.invalid"); } catch { return { src }; }
  const upload = /^\/uploads\/[a-zA-Z0-9_-]+\.(png|jpe?g|webp)$/i.test(url.pathname);
  const unsplash = url.hostname === "images.unsplash.com";
  // Signed and arbitrary external image URLs are left untouched.
  if ((!upload && !unsplash) || (upload && url.search)) return { src };
  const atWidth = width => {
    const next = new URL(url);
    next.searchParams.set("w", width);
    if (unsplash) {
      next.searchParams.set("auto", "format");
      next.searchParams.set("q", "78");
    }
    return url.hostname === "relative.invalid" ? `${next.pathname}${next.search}` : next.href;
  };
  return { src: atWidth(960), srcSet: widths.map(width => `${atWidth(width)} ${width}w`).join(", "), sizes };
}
