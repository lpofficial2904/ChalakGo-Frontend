// Share only public content GETs. Auth and booking requests use normal fetch.
const responses = new Map();
const ttlMs = 30000;
const storagePrefix = "chalakgo-public-v1:";
// Only public website content can survive a reload; never persist auth/bookings.
function canPersist(url, options) {
  try {
    const path = new URL(url, "https://relative.invalid").pathname;
    return /^\/api\/(settings|services|pages|page-status|blogs|reviews)$/.test(path) && !options.headers && options.credentials !== "include";
  } catch { return false; }
}
function readStored(key) {
  try {
    const value = JSON.parse(sessionStorage.getItem(storagePrefix + key));
    if (value?.expires > Date.now() && typeof value.body === "string") return value;
    sessionStorage.removeItem(storagePrefix + key);
  } catch { /* Storage can be disabled or full. Network requests still work. */ }
  return null;
}
export function clearSiteCache() {
  responses.clear();
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(storagePrefix)) sessionStorage.removeItem(key);
    }
  } catch { /* Storage is optional. */ }
}

export function siteFetch(url, options = {}) {
  const { signal, ...sharedOptions } = options;
  if (!signal) return sharedFetch(url, options);
  if (signal.aborted) return Promise.reject(signal.reason || new DOMException("Aborted", "AbortError"));
  return new Promise((resolve, reject) => {
    const aborted = () => reject(signal.reason || new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", aborted, { once: true });
    sharedFetch(url, sharedOptions).then(resolve, reject).finally(() => signal.removeEventListener("abort", aborted));
  });
}

async function sharedFetch(url, options = {}) {
  if ((options.method && options.method !== "GET") || options.headers || options.credentials === "include") return fetch(url, options);
  const key = `${url}|${options.credentials || "same-origin"}`;
  let entry = responses.get(key);
  if (!entry && canPersist(url, options)) {
    const stored = readStored(key);
    if (stored) {
      entry = { expires: stored.expires, promise: Promise.resolve(new Response(stored.body, { headers: { "Content-Type": "application/json" } })) };
      responses.set(key, entry);
    }
  }
  if (!entry || entry.expires <= Date.now()) {
    entry = { expires: Infinity };
    entry.promise = fetch(url, options).then((response) => {
      entry.expires = Date.now() + ttlMs;
      if (!response.ok && responses.get(key) === entry) responses.delete(key);
      if (response.ok && canPersist(url, options) && response.headers.get("content-type")?.includes("application/json")) {
        response.clone().text().then(body => {
          // An admin update must also invalidate a pending storage write.
          if (responses.get(key) !== entry || body.length > 500000) return;
          try { sessionStorage.setItem(storagePrefix + key, JSON.stringify({ body, expires: entry.expires })); } catch { /* Optional cache. */ }
        }).catch(() => {});
      }
      return response;
    }).catch((error) => {
      if (responses.get(key) === entry) responses.delete(key);
      throw error;
    });
    if (responses.size >= 200) responses.delete(responses.keys().next().value);
    responses.set(key, entry);
  }
  const response = await entry.promise;
  // A save may invalidate an in-flight request. Do not let that old response
  // overwrite the new prices when it eventually reaches a mounted component.
  if (response.ok && responses.get(key) !== entry) return siteFetch(url, options);
  return response.clone();
}
