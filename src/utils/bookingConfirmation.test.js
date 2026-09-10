import test from "node:test";
import assert from "node:assert/strict";
import { bookingConfirmation } from "./bookingConfirmation.js";

test("successful older API response without fare does not crash or invent a fare", () => {
  const message = bookingConfirmation(
    { booking: { bookingId: "test-id", duration: "6 hours 1 minute" } },
    true,
  );
  assert.match(message, /saved successfully/);
  assert.match(message, /test-id/);
  assert.doesNotMatch(message, /Total estimate|undefined|NaN/);
});

test("valid server fare is displayed with two decimals", () => {
  assert.match(
    bookingConfirmation({ booking: { totalFare: 795.65 } }, true),
    /₹795\.65/,
  );
  assert.match(
    bookingConfirmation({ booking: { totalFare: 596 } }, true),
    /₹596\.00/,
  );
});

test("missing or invalid response fields cannot crash success formatting", () => {
  for (const data of [
    undefined,
    {},
    { booking: null },
    { booking: { totalFare: null } },
    { booking: { totalFare: "bad" } },
    { booking: { totalFare: Infinity } },
  ]) {
    assert.match(bookingConfirmation(data, true), /saved successfully/);
    assert.doesNotMatch(bookingConfirmation(data, true), /Total estimate/);
  }
});
