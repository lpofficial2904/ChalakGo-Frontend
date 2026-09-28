// Share only public content GETs. Auth and booking requests use normal fetch.
const responses = new Map();
const ttlMs = 30000;
export function clearSiteCache() { responses.clear(); }

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
  if (options.method && options.method !== "GET") return fetch(url, options);
  const key = `${url}|${options.credentials || "same-origin"}`;
  let entry = responses.get(key);
  if (!entry || entry.expires <= Date.now()) {
    entry = { expires: Infinity };
    entry.promise = fetch(url, options).then((response) => {
      entry.expires = Date.now() + ttlMs;
      if (!response.ok && responses.get(key) === entry) responses.delete(key);
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
