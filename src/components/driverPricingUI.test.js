import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { JSDOM } from "jsdom";
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_DRIVER_PRICING, calculateDriverOnlyFare } from "../shared/driverPricing.js";
import { calculateDistanceFare, calculateMonthlyFare, calculateFixedFare } from "../utils/fare.js";

test("selecting a card immediately updates the estimate; schedules show extra and night charges", async () => {
  const server = await createServer({ configFile: false, root: fileURLToPath(new URL("../../", import.meta.url)), plugins: [react()], server: { middlewareMode: true, watch: null, hmr: false }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
  const dom = new JSDOM("<div id='root'></div>");
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let root;
  try {
    const { default: Plans } = await server.ssrLoadModule("/src/components/DriverPlans.jsx");
    const { default: Estimate } = await server.ssrLoadModule("/src/components/DriverFareEstimate.jsx");
    function Form() {
      const [selected, setSelected] = useState("4");
      return React.createElement(React.Fragment, null,
        React.createElement(Plans, { compact: true, pricing: DEFAULT_DRIVER_PRICING, selected, onSelect: setSelected }),
        React.createElement(Estimate, { pricing: DEFAULT_DRIVER_PRICING, selected, fare: null, hasSchedule: false }));
    }
    root = createRoot(document.getElementById("root"));
    await act(async () => root.render(React.createElement(Form)));
    const total = () => document.querySelector("section[aria-live]").textContent;
    assert.match(total(), /TOTAL ESTIMATE₹499/);
    const buttons = document.querySelectorAll("button");
    assert.equal(buttons.length, 5);
    await act(async () => buttons[1].click());
    assert.equal(buttons[1].getAttribute("aria-pressed"), "true");
    assert.equal(buttons[0].getAttribute("aria-pressed"), "false");
    assert.match(total(), /TOTAL ESTIMATE₹899/);
    const fare = calculateDriverOnlyFare({ driverPackage: "8", startDateTime: "2026-09-28T14:00", endDateTime: "2026-09-28T23:00" });
    await act(async () => root.render(React.createElement(Estimate, { pricing: DEFAULT_DRIVER_PRICING, selected: "8", fare, hasSchedule: true })));
    assert.match(total(), /Additional Hours \(1 hrs @ ₹99\/hr\):₹99/);
    assert.match(total(), /Night Charge.*\+₹200/);
    assert.match(total(), /TOTAL ESTIMATE₹1,198/);
    const { default: ServiceEstimate } = await server.ssrLoadModule("/src/components/ServiceFareEstimate.jsx");
    for (const [carType, distanceKm, expected] of [["SUV", 260, "₹3,620"], ["Hatchback", 270, "₹3,220"], ["Haravan Traveller", 100, "₹3,500"]]) {
      const distanceFare = calculateDistanceFare({ carType, distanceKm, vehicleRates: { suv: 12, hatchback: 11, traveller: 35 } });
      await act(async () => root.render(React.createElement(ServiceEstimate, { kind: "distance", selected: carType, fare: distanceFare })));
      assert.ok(total().includes(`TOTAL ESTIMATE${expected}`));
      assert.ok(total().includes(`${distanceKm} km`));
    }
    const monthly = calculateMonthlyFare({ duration: "8–10 Hours / Day", monthlyRates: { eightToTen: 18000 } });
    await act(async () => root.render(React.createElement(ServiceEstimate, { kind: "monthly", selected: "8–10 Hours / Day", duration: "8–10 Hours / Day", fare: monthly })));
    assert.match(total(), /TOTAL ESTIMATE₹18,000\/month/);
    for (const [days, price] of [[1, "₹2,999"], [2, "₹3,499"]]) {
      const fixed = calculateFixedFare({ tourPlanPrice: price });
      await act(async () => root.render(React.createElement(ServiceEstimate, { kind: "fixed", selected: `${days}-day Jaipur Tour`, days, fare: fixed })));
      assert.ok(total().includes(`TOTAL ESTIMATE${price}`));
    }
    await act(async () => root.render(React.createElement(ServiceEstimate, { kind: "distance", selected: "SUV", fare: null, error: "Enter a valid trip distance" })));
    assert.match(total(), /TOTAL ESTIMATE—/);
  } finally {
    if (root) await act(async () => root.unmount());
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    dom.window.close();
    await server.close();
  }
});
