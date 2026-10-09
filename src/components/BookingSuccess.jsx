import { Check, X } from "lucide-react";
import { toast } from "sonner";
import "./BookingSuccess.css";

let homeRedirectTimer;

export function showBookingSuccess(booking, serviceName, loadingId) {
  if (loadingId !== undefined) toast.dismiss(loadingId);
  window.clearTimeout(homeRedirectTimer);
  homeRedirectTimer = window.setTimeout(() => {
    toast.dismiss();
    window.location.assign("/");
  }, 3000);
  return toast.custom((id) => (
    <section className="booking-success" role="alertdialog" aria-live="assertive" aria-modal="true" aria-labelledby="booking-success-title">
      <button type="button" className="booking-success-close" aria-label="Dismiss booking confirmation" onClick={() => toast.dismiss(id)}><X size={17} /></button>
      <div className="booking-success-heading">
        <span className="booking-success-icon"><Check size={23} strokeWidth={2.5} aria-hidden="true" /></span>
        <div><p className="booking-success-eyebrow">BOOKING CONFIRMED</p><h3 id="booking-success-title">Booking successful</h3></div>
      </div>
      <p className="booking-success-copy">Your booking request is saved. Our team will call you shortly. Redirecting to home in 3 seconds.</p>
      <div className="booking-success-summary">
        {serviceName && <p className="booking-success-service">{serviceName}</p>}
        {typeof booking?.totalFare === "number" && Number.isFinite(booking.totalFare) && <div className="booking-success-fare"><span>Estimated fare</span><strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(booking.totalFare)}</strong></div>}
        {booking?.bookingId && <p className="booking-success-reference"><span>Booking reference</span><strong>{booking.bookingId}</strong></p>}
        <span className="booking-success-progress" aria-hidden="true" />
      </div>
    </section>
  ), { duration: 3000 });
}
