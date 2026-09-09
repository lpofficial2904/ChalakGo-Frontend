export function bookingConfirmation(data, temporary) {
  const booking = data?.booking
  const parts = ['Booking request saved successfully.']
  if (booking?.bookingId) parts.push(`Booking ID: ${booking.bookingId}.`)
  if (temporary && typeof booking?.duration === 'string')
    parts.push(`Duration: ${booking.duration}.`)
  // Older API deployments may omit a fare. Do not turn a successful save into
  // a failure, or present a client estimate as a server-confirmed amount.
  if (temporary && typeof booking?.totalFare === 'number' && Number.isFinite(booking.totalFare)) {
    parts.push(`Total estimate: ₹${booking.totalFare.toFixed(2)}.`)
  }
  parts.push('Our team will contact you shortly.')
  return parts.join(' ')
}
