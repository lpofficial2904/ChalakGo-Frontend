const key = "chalakgo_booking_draft";
export function readBookingDraft(slug) {
  try {
    const draft = JSON.parse(sessionStorage.getItem(key));
    return draft?.slug === slug && Date.now() - draft.savedAt < 60 * 60 * 1000
      ? draft
      : null;
  } catch {
    return null;
  }
}
export function saveBookingDraft(draft) {
  sessionStorage.setItem(
    key,
    JSON.stringify({ ...draft, savedAt: Date.now() }),
  );
}
export function clearBookingDraft() {
  sessionStorage.removeItem(key);
}
export function bookingReturnPath(value) {
  return typeof value === "string" &&
    /^\/services\/[a-z0-9-]+(?:#booking)?$/.test(value)
    ? value
    : "/services";
}
