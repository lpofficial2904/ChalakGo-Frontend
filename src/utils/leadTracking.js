const delivered = new Set();
export function trackLead(kind, id) {
  if (!id || typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  const key = `${kind}:${id}`;
  try { if (sessionStorage.getItem('chalakgo-lead:' + key)) return false; } catch { /* In-memory deduplication remains available. */ }
  if (delivered.has(key)) return false;
  delivered.add(key);
  try { sessionStorage.setItem('chalakgo-lead:' + key, '1'); } catch { /* Storage is optional. */ }
  // No personal data, route addresses or form text enter analytics.
  try {
    window.gtag('event', 'generate_lead', { lead_type: kind, transaction_id: String(id) });
    const label = kind === 'booking' ? import.meta.env?.VITE_GOOGLE_ADS_BOOKING_LABEL : import.meta.env?.VITE_GOOGLE_ADS_ENQUIRY_LABEL;
    if (label && /^[a-zA-Z0-9_-]+$/.test(label)) window.gtag('event', 'conversion', { send_to: `AW-18427140311/${label}`, transaction_id: String(id) });
  } catch { return false; /* Analytics must never interrupt a saved booking. */ }
  return true;
}
