import { driverPricing } from "../../../shared/driverPricing.js";

const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

export default function DriverPlans({ pricing: value, selected, onSelect, compact = false }) {
  const pricing = driverPricing(value);
  const dailyPrice = pricing.plans.find((plan) => plan.id === "outstation").price;
  if (compact) return <fieldset className="min-w-0 sm:col-span-2">
    <legend className="mb-3 text-sm font-bold">Select Driver Package / Plan</legend>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {pricing.plans.map(plan => <button key={plan.id} type="button" aria-pressed={selected === plan.id} onClick={() => onSelect(plan.id)} className={`rounded-xl border p-3 text-left ${selected === plan.id ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600" : "border-slate-200 bg-white hover:bg-blue-50"}`}>
        <span className="block text-xs text-blue-600">✓ {plan.label}</span>
        <span className="mt-1 block"><strong className="text-sm">{money(plan.price)}</strong><span className="text-xs text-slate-500"> / {plan.id === "outstation" ? "day" : `${plan.hours} hrs`}</span></span>
        <span className="mt-1 block text-xs text-slate-500">{plan.id === "outstation" ? "per day" : `Extra: ${money(pricing.additionalHourlyRate)}/hr`}</span>
      </button>)}
    </div>
  </fieldset>;
  return <section className="mt-10" aria-label="Driver Only pricing plans">
    <h2 className="text-2xl font-extrabold">Select Driver Only Pricing Plan</h2>
    <p className="mt-2 text-sm text-slate-600">Choose a package below to start booking. Extra hours beyond the plan are counted at {money(pricing.additionalHourlyRate)}/hr.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {pricing.plans.map((plan) => {
        const active = selected === plan.id;
        const outstation = plan.id === "outstation";
        return <article key={plan.id} className={`flex flex-col rounded-2xl border p-5 shadow-sm ${active ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600" : "border-slate-200 bg-white"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-blue-600">
            <span className="rounded-full bg-blue-100 px-2 py-1">✓ {plan.label}</span>
            {active && <span>Selected ✓</span>}
          </div>
          <p className="mt-4"><strong className="text-2xl font-extrabold">{money(plan.price)}</strong><span className="text-xs text-slate-500"> / {outstation ? "day" : `${plan.hours} hrs`}</span></p>
          <p className="mt-2 min-h-12 text-sm text-slate-600">{plan.description}</p>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="mb-3 text-xs text-slate-500">{outstation ? `${money(plan.price)}/day + food/stay` : `Extra hours: ${money(pricing.additionalHourlyRate)}/hr`}</p>
            <button type="button" aria-pressed={active} onClick={() => onSelect(plan.id)} className={`w-full rounded-lg px-2 py-2 text-sm font-semibold ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800 hover:bg-blue-100"}`}>{active ? "Selected ✓" : "Select Plan →"}</button>
          </div>
        </article>;
      })}
    </div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm"><h3 className="font-bold text-blue-600">NIGHT CHARGE POLICY</h3><p className="mt-1 font-semibold">+{money(pricing.nightCharge)} night charge applies</p><p className="mt-1 text-xs text-slate-600">Applicable once for any booking that operates between 10:00 PM and 6:00 AM.</p></div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm"><h3 className="font-bold text-blue-600">ADDITIONAL HOURS</h3><p className="mt-1 font-semibold">{money(pricing.additionalHourlyRate)}/hour</p><p className="mt-1 text-xs text-slate-600">Automatically counted when actual booking duration exceeds selected package hours. Outstation: {money(dailyPrice)}/day + food/stay.</p></div>
    </div>
  </section>;
}
