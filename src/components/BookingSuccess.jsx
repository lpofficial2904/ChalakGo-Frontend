import { Check, X } from "lucide-react";
import { toast } from "sonner";
import "./BookingSuccess.css";

export function showBookingSuccess(booking, serviceName, loadingId) {
  if (loadingId !== undefined) toast.dismiss(loadingId);
  return toast.custom((id) => (
    <section className="booking-success" role="status" aria-live="polite">
      <button type="button" className="booking-success-close" aria-label="Dismiss booking confirmation" onClick={() => toast.dismiss(id)}><X size={17} /></button>
      <div className="booking-success-heading">
        <span className="booking-success-icon"><Check size={23} strokeWidth={2.5} aria-hidden="true" /></span>
        <div><p className="booking-success-eyebrow">REQUEST RECEIVED</p><h3>You're one step closer.</h3></div>
      </div>
      <p className="booking-success-copy">Your booking request is saved. Our team will call you shortly to confirm your ride.</p>
      <div className="booking-success-summary">
        {serviceName && <p className="booking-success-service">{serviceName}</p>}
        {typeof booking?.totalFare === "number" && Number.isFinite(booking.totalFare) && <div className="booking-success-fare"><span>Estimated fare</span><strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(booking.totalFare)}</strong></div>}
        {booking?.bookingId && <p className="booking-success-reference"><span>Booking reference</span><strong>{booking.bookingId}</strong></p>}
      </div>
    </section>
  ), { duration: 10000 });
}
