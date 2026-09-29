import test from "node:test";
import assert from "node:assert/strict";
import { siteFetch, clearSiteCache } from "./siteFetch.js";

test("fresh public content survives reload, expires, and clears after an admin update", async (t) => {
  const data = new Map();
  const original = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: {
    getItem: key => data.get(key) || null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key),
    key: index => [...data.keys()][index],
    get length() { return data.size; },
  } });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, "sessionStorage", original);
    else delete globalThis.sessionStorage;
  });
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; return Response.json({ price: 599 }); });
  const key = 'chalakgo-public-v1:/api/services|same-origin';
  data.set(key, JSON.stringify({ body: JSON.stringify({ price: 499 }), expires: Date.now() + 30000 }));
  const reloaded = await import('./siteFetch.js?reload-test');
  assert.equal((await (await reloaded.siteFetch('/api/services')).json()).price, 499);
  assert.equal(calls, 0);
  reloaded.clearSiteCache();
  assert.equal(data.size, 0);
  assert.equal((await (await reloaded.siteFetch('/api/services')).json()).price, 599);
  assert.equal(calls, 1);
  data.set(key, JSON.stringify({ body: '{}', expires: Date.now() - 1 }));
  const expired = await import('./siteFetch.js?expired-test');
  await expired.siteFetch('/api/services');
  assert.equal(calls, 2);
});

test("public fetch shares requests, clones bodies, and refreshes on invalidation", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; return Response.json({ price: calls === 1 ? 499 : 599 }); });
  clearSiteCache();
  const responses = await Promise.all([siteFetch("/api/services"), siteFetch("/api/services"), siteFetch("/api/services")]);
  assert.equal(calls, 1);
  assert.deepEqual(await Promise.all(responses.map(response => response.json())), [{ price: 499 }, { price: 499 }, { price: 499 }]);
  clearSiteCache();
  assert.equal((await (await siteFetch("/api/services")).json()).price, 599);
  assert.equal(calls, 2);
});

test("unsuccessful responses are not cached", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; return new Response("Unavailable", { status: 503 }); });
  clearSiteCache();
  await siteFetch("/api/services");
  await siteFetch("/api/services");
  assert.equal(calls, 2);
});

test("an admin save during a pending request cannot restore old prices", async (t) => {
  let finishOld;
  let calls = 0;
  t.mock.method(globalThis, "fetch", () => {
    calls++;
    return calls === 1 ? new Promise(resolve => { finishOld = resolve; }) : Promise.resolve(Response.json({ price: 599 }));
  });
  clearSiteCache();
  const old = siteFetch("/api/services");
  clearSiteCache();
  const fresh = await siteFetch("/api/services");
  finishOld(Response.json({ price: 499 }));
  assert.equal((await (await old).json()).price, 599);
  assert.equal((await fresh.json()).price, 599);
  assert.equal(calls, 2);
});

test("aborting one component does not cancel shared content for other consumers", async (t) => {
  let finish;
  let calls = 0;
  t.mock.method(globalThis, "fetch", () => { calls++; return new Promise(resolve => { finish = resolve; }); });
  clearSiteCache();
  const controller = new AbortController();
  const stopped = siteFetch("/api/pages", { signal: controller.signal });
  const active = siteFetch("/api/pages");
  controller.abort();
  await assert.rejects(stopped, { name: "AbortError" });
  finish(Response.json([{ slug: "home" }]));
  assert.deepEqual(await (await active).json(), [{ slug: "home" }]);
  assert.equal(calls, 1);
});
