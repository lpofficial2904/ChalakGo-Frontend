// Support editor-authored Markdown links without rendering raw HTML.
export function safeBlogHref(value) {
  if (typeof value !== 'string' || /[\s\\\u0000-\u001f\u007f]/.test(value)) return null;
  if (/^\/(?!\/)/.test(value) || /^#[a-zA-Z0-9_-]+$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href;
  } catch { /* Invalid and unsupported destinations remain plain text. */ }
  return null;
}

export function blogTextParts(value) {
  const parts = [];
  const pattern = /\[([^\]\n]+)\]\(([^)\n]+)\)/g;
  let cursor = 0;
  for (const match of value.matchAll(pattern)) {
    if (match.index > cursor) parts.push({ text: value.slice(cursor, match.index) });
    const href = safeBlogHref(match[2]);
    parts.push(href ? { text: match[1], href } : { text: match[0] });
    cursor = match.index + match[0].length;
  }
  if (cursor < value.length) parts.push({ text: value.slice(cursor) });
  return parts;
}
