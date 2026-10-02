import test from "node:test";
import assert from "node:assert/strict";
import { servicePriceLabel } from "./servicePricing.js";

test("main service price labels follow their configured rates", () => {
  assert.equal(
    servicePriceLabel({
      slug: "driver-only",
      driverPricing: { plans: [{ id: "4", price: 699 }, { id: "8", price: 999 }] },
      price: "stale display text",
    }),
    "Plans from ₹699",
  );
  assert.equal(
    servicePriceLabel({
      slug: "car-driver",
      vehicleRates: { suv: 18, hatchback: 14, traveller: 35 },
      price: "stale display text",
    }),
    "Cab fares from ₹14/km",
  );
  assert.equal(
    servicePriceLabel({
      slug: "permanent-driver",
      monthlyRates: { sixToEight: 16000, eightToTen: 19000, tenToTwelve: 24000 },
      price: "stale display text",
    }),
    "Plans from ₹16,000/month",
  );
  assert.equal(
    servicePriceLabel({
      slug: "jaipur-tour",
      pricingType: "fixed",
      tourPlans: [{ days: 1, price: "₹3,299" }, { days: 2, price: "₹4,499" }],
      price: "stale display text",
    }),
    "Plans from ₹3,299",
  );
});

test("custom service price labels and missing structured rates remain supported", () => {
  assert.equal(
    servicePriceLabel({ slug: "airport-transfer", price: "From ₹799" }),
    "From ₹799",
  );
  assert.equal(
    servicePriceLabel({ slug: "car-driver", price: "SUV ₹18/km" }),
    "SUV ₹18/km",
  );
});
