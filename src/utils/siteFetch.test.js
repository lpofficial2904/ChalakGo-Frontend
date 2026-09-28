import test from "node:test";
import assert from "node:assert/strict";
import { siteFetch, clearSiteCache } from "./siteFetch.js";

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
