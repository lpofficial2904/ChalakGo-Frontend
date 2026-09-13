import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act, useEffect } from "react";
import usePickupCoordinates from "./usePickupCoordinates.js";

test("pickup acquisition recovers after StrictMode cleanup, timeout and permission denial", async (t) => {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost/" });
  const originals = Object.fromEntries(["window", "document", "navigator", "IS_REACT_ACT_ENVIRONMENT"].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, navigator: dom.window.navigator, IS_REACT_ACT_ENVIRONMENT: true }))
    Object.defineProperty(globalThis, key, { value, configurable: true });
  Object.defineProperty(window, "isSecureContext", { value: true });
  const requests = [];
  Object.defineProperty(navigator, "geolocation", { value: {
    getCurrentPosition(success, failure) { requests.push({ success, failure }); },
  } });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root"));
  let state;
  function Probe() {
    state = usePickupCoordinates();
    useEffect(() => { void state.fetchInitialLocation(); }, [state.fetchInitialLocation]);
    return React.createElement("output", null, state.loading ? "Fetching" : state.error || JSON.stringify(state.coordinates));
  }
  const coords = { latitude: 26.91, longitude: 75.78, accuracy: 12 };
  try {
    await act(async () => root.render(React.createElement(React.StrictMode, null, React.createElement(Probe))));
    assert.equal(requests.length, 2, "StrictMode must start a fresh request after aborting the first");
    await act(async () => requests[1].success({ coords, timestamp: Date.now() }));
    assert.equal(state.loading, false);
    assert.deepEqual(state.coordinates, coords);
    await act(async () => requests[0].success({ coords: { ...coords, latitude: 0 }, timestamp: Date.now() }));
    assert.deepEqual(state.coordinates, coords, "late cancelled request must not overwrite current fix");

    await act(async () => { void state.fetchLocation(); });
    await act(async () => requests.at(-1).failure({ code: 1 }));
    assert.equal(state.loading, false);
    assert.match(state.error, /Allow location/);

    t.mock.timers.enable({ apis: ["setTimeout"] });
    await act(async () => { void state.fetchLocation(); });
    await act(async () => t.mock.timers.tick(4001));
    assert.equal(state.loading, false, "silent geolocation provider must not hang the form");
    assert.match(state.error, /timed out/);
    t.mock.timers.reset();

    await act(async () => { void state.fetchLocation(); });
    await act(async () => requests.at(-1).success({ coords, timestamp: Date.now() }));
    assert.equal(state.loading, false);
    assert.equal(state.error, "");
    assert.deepEqual(state.coordinates, coords);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
