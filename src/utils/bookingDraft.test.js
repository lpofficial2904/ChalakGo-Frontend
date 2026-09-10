import test from "node:test";
import assert from "node:assert/strict";
import {
  readBookingDraft,
  saveBookingDraft,
  clearBookingDraft,
  bookingReturnPath,
} from "./bookingDraft.js";

test("booking draft preserves form, coordinates and tour plan across login and clears on completion", () => {
  const data = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => data.get(key),
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  const draft = {
    slug: "jaipur-tour",
    planDays: 2,
    form: { fullName: "Test", city: "Jaipur" },
    locationMode: "current",
    coordinates: { latitude: 26, longitude: 75, accuracy: 20 },
    timestamp: Date.now(),
  };
  saveBookingDraft(draft);
  assert.deepEqual(readBookingDraft("jaipur-tour").form, draft.form);
  assert.deepEqual(
    readBookingDraft("jaipur-tour").coordinates,
    draft.coordinates,
  );
  assert.equal(readBookingDraft("jaipur-tour").planDays, 2);
  assert.equal(readBookingDraft("car-driver"), null);
  clearBookingDraft();
  assert.equal(readBookingDraft("jaipur-tour"), null);
  data.set("chalakgo_booking_draft", "{broken");
  assert.equal(readBookingDraft("jaipur-tour"), null);
});

test("login returns only to an internal service booking route", () => {
  assert.equal(
    bookingReturnPath("/services/car-driver#booking"),
    "/services/car-driver#booking",
  );
  for (const path of [
    undefined,
    "//example.com",
    "https://example.com",
    "/login",
  ])
    assert.equal(bookingReturnPath(path), "/services");
});
