const money = value => `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function DriverFareEstimate({ pricing, selected, fare, error, hasSchedule }) {
  const plan = pricing.plans.find(item => item.id === selected);
  if (!plan) return null;
  const outstation = plan.id === "outstation";
  const hours = fare?.baseHours ?? (outstation ? 24 : plan.hours);
  const extraHours = fare?.additionalHours ?? 0;
  const row = (title, value, border = false) => <div className={`flex flex-wrap justify-between gap-x-4 gap-y-1 py-1 ${border ? "mb-2 border-b border-blue-100 pb-3" : ""}`}><dt>{title}</dt><dd className="font-medium sm:text-right">{value}</dd></div>;
  return <section aria-live="polite" className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 text-sm text-[#10213f] sm:col-span-2">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-base font-extrabold">Temporary Driver Fare Estimate</h3><span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">Plan: {plan.label}</span></div>
    <dl className="mt-4">
      {row("Selected Package:", plan.label, true)}
      {row("Base Package Fare:", `${money(fare?.baseFare ?? plan.price)} (up to ${hours} hrs included)`)}
      {row("Trip Duration:", fare ? `${outstation ? `${plan.label} · ${fare.days} Days ` : ""}(${Math.floor(fare.durationMinutes / 60)}h ${fare.durationMinutes % 60}m)` : "Select start and end date/time")}
      {row(`Additional Hours (${Number(extraHours.toFixed(2))} hrs @ ${money(pricing.additionalHourlyRate)}/hr):`, `${money(fare?.additionalFare ?? 0)}${extraHours === 0 ? " (Within package)" : ""}`)}
      {!!fare?.nightFare && row("Night Charge (10 PM – 6 AM):", `+${money(fare.nightFare)}`)}
    </dl>
    {hasSchedule && !fare && error && <p className="mt-2 text-red-700">{error}</p>}
    <div className="mt-3 flex items-center justify-between gap-4 border-t border-blue-200 pt-4 text-base font-extrabold"><span>TOTAL ESTIMATE</span><span className="text-xl text-blue-600">{hasSchedule && !fare ? "—" : money(fare?.totalFare ?? plan.price)}</span></div>
    {!fare && !hasSchedule && <p className="mt-2 text-xs text-slate-500">Package estimate. Select dates and times to calculate the trip total.</p>}
    <p className="mt-3 text-xs text-slate-500">* Extra hours beyond package counted at {money(pricing.additionalHourlyRate)}/hr. Night trips (10 PM – 6 AM) add +{money(pricing.nightCharge)} once. Outstation: driver food &amp; stay extra.</p>
  </section>;
}
